import { Request, Response } from "express";
import {
  okRes,
  getOTP,
  hashMyPassword,
  comparePassword,
  sendSMS,
  paginate,
} from "../../helpers/tools";
import * as validate from "validate.js";
import validation from "../../helpers/validation.helper";
import { User } from "../../src/entity/user/user";
import * as PhoneFormat from "iqphone";
// import PhoneFormat from "../../helpers/phone.helper";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import { getConnection } from "typeorm";
import { PortfiloItem } from "../../src/entity/user/portfilo_item";
import {
  handleException,
  ExceptionObject,
  handleUnknownError,
  handleVailditionError,
  PostgressErrorHelper,
} from "../../helpers/handle_error";
import { SkillUser } from "../../src/entity/user/skillsuser";
import { auth } from "firebase-admin";
import { AuthService } from "../../src/service/auth.service";
import { UserService } from "../../src/service/user.service";
import { registerUserVaildate } from "../../helpers/validate/register_vaildate";
import { Skills } from "../../src/entity/user/skills";

// import { Product } from "../../src/entity/Product";
// import { Invoice } from "../../src/entity/Invoice";
// import { InvoiceItem } from "../../src/entity/InvoiceItem";
// import * as ZC from "zaincash";
// import * as imgbbUploader from "imgbb-uploader";
// import * as fs from "fs";

export default class UserController {
  static async createNewUser(req, res): Promise<object> {
    const decoded: auth.DecodedIdToken = req.decoded;
    let notValid = validate(req.body, registerUserVaildate);
    if (notValid) return handleVailditionError(res, notValid);

    if (decoded["isreg"]) {
      console.log("isreg true");
      let user = await UserService.getById(decoded.uid);
      if (user) return okRes(res, user);
    }

    try {
      let user = User.create({
        id: decoded.uid,
        email: decoded.email,
        phone: decoded.phone_number,
        name: req.body.name,
        bio: req.body.bio,
        city: req.body.city,
        picture: req.body.picture ?? decoded.picture,
      });

      user = await user.save();
      console.log("saved");
      if (req.body.skills) {
        const res = await UserService.addListOfSkills(user, req.body.skills);
        user.skills = res; 
      
      }

      AuthService.addisregToToken(user.id);

      return okRes(res, user);
    } catch (error) {
      // console.log(error);

      if (error instanceof ExceptionObject) return handleException(res, error); // from add skills

      if (
        PostgressErrorHelper.isUNIQUE_VIOLATION(error.code) &&
        (error.detail as String).includes("id")
      ) {
        let user = await UserService.getById(decoded.uid);
        return okRes(res, user);
      }

      return handleUnknownError(res, error);
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  static async editUser(req, res): Promise<object> {
    // get the user let user = req.user
    let user: User = req.user;

    let isNotValid = validate(req.body, validation.editUser());
    if (isNotValid) return handleVailditionError(res, isNotValid);

    //editing data
    user.name = req.body.newName;
    user.bio = req.body.newBio;
    user.city = req.body.newCity;

    await user.save();
    user.hiddenSensitiveInfo();
    return okRes(res, user);
  }

  /**
   *
   * @param req
   * @param res
   */

  static async getUser(req, res): Promise<object> {
    let id = req.params.user;

    const active = true;

    try {
      const user = await User.createQueryBuilder()
        .select()
        .where("User.id = :id", {
          id,
        })
        .andWhere("User.active=true")
        .leftJoinAndSelect("User.services", "service", "service.active=true")
        .leftJoinAndSelect("User.portfiloItems", "portfiloItem")
        .leftJoinAndSelect("User.skills", "skills")

        .getOne();
      //hide sensitive info before sent object
      if (!user) return handleException(res, ExceptionObject.NotExist);
      user.hiddenSensitiveInfo();

      return okRes(res, user);
    } catch (error) {
      console.log(error);
      return handleUnknownError(res, error);
    }
  }

  static async createPortfiloItem(req, res): Promise<object> {
    // const newPortfiloItem = ;
    let notValid = validate(req.body, validation.newPortfiloItem());
    if (notValid) return handleVailditionError(res, notValid);
    const user = req.user;
    let newPortfiloItem: PortfiloItem;
    try {
      newPortfiloItem = await PortfiloItem.findOne({
        where: { title: req.body.title },
      });
      if (newPortfiloItem)
        return handleException(res, ExceptionObject.TitleAlreadyExist);
    } catch (error) {
      return handleUnknownError(res, error);
    }

    try {
      newPortfiloItem = PortfiloItem.create({
        title: req.body.title,
        description: req.body.description,
        images: req.body.images,
        link: req.body.link,
        user: user,
      });
      await newPortfiloItem.save();
      delete newPortfiloItem.user;
      return okRes(res, newPortfiloItem);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async addListOfSkills(req, res): Promise<object> {
    let notValid = validate(req.body, validation.skillsArray());
    if (notValid) return handleVailditionError(res, notValid);

    const user: User = req.user;
    const skills: string[] = req.body.skills;

    try {
      let res = await UserService.addListOfSkills(user, skills);
      return okRes(res, res);
    } catch (error) {
      if (error instanceof ExceptionObject) return handleException(res, error);
      return handleUnknownError(res, error);
    }
  }

  static async deleteListOfSkills(req, res): Promise<object> {
    let notValid = validate(req.body, validation.skillsArray());
    if (notValid) return handleVailditionError(res, notValid);

    const user: User = req.user;
    const skills: string[] = req.body.skills;

    try {
      let resInsert = await getConnection()
        .createQueryBuilder()
        .delete()
        .from("users_skills_skills")
        .where("userId = :userId And skillName IN (:...names)", {
          userId: user.id,
          names: skills,
        })
        .execute();
      if (resInsert.affected < 1)
        return handleException(res, ExceptionObject.NotExist);

      return okRes(res, "done");
    } catch (error) {
      if (PostgressErrorHelper.isFOREIGN_KEY_VIOLATION(error.code))
        return handleException(res, ExceptionObject.NotExist);

      if (PostgressErrorHelper.isUNIQUE_VIOLATION(error.code))
        return handleException(res, ExceptionObject.AlreadyExist);

      return handleUnknownError(res, error);
    }
  }

  static async getSkillsFromUserId(req, res): Promise<object> {
    const userId = req.params.userId;

    try {
      let skills = await SkillUser.find({
        where: { userId: userId },
        select: ["skillName"],
      });

      return okRes(res, skills);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async editPortfiloItem(req, res): Promise<object> {
    // const newPortfiloItem = ;
    let notValid = validate(req.body, validation.editPortfiloItem());
    if (notValid) return handleVailditionError(res, notValid);
    const user = req.user;
    const portfiloId = req.params.portfiloId;
    let oldPortfiloItem: PortfiloItem;
    try {
      oldPortfiloItem = await PortfiloItem.findOne({
        where: { id: portfiloId },
      });
      if (!oldPortfiloItem)
        return handleException(res, ExceptionObject.NotExist);
      if (oldPortfiloItem.userId != user.id) {
        return handleException(res, ExceptionObject.NotHavePermission);
      }

      oldPortfiloItem.images = req.body.images;
      oldPortfiloItem.link = req.body.link;
      oldPortfiloItem.description = req.body.description;
      oldPortfiloItem.title = req.body.title;
      await oldPortfiloItem.save();
      return okRes(res, oldPortfiloItem);
    } catch (error) {
      if (PostgressErrorHelper.isFOREIGN_KEY_VIOLATION(error.code))
        return handleException(res, ExceptionObject.TitleAlreadyExist);
      console.log(error);
      return handleUnknownError(res, error);
    }
  }

  static async deletePortfiloItem(req, res): Promise<object> {
    // const newPortfiloItem = ;
    const user = req.user;
    const portfiloId = req.params.portfiloId;

    let oldPortfiloItem: PortfiloItem;
    try {
      oldPortfiloItem = await PortfiloItem.findOne({
        where: { id: portfiloId },
      });
      //TODO:: make code to delete its image too
      if (!oldPortfiloItem)
        return handleException(res, ExceptionObject.NotExist);

      if (oldPortfiloItem.userId != user.id) {
        return handleException(res, ExceptionObject.NotHavePermission);
      }

      await oldPortfiloItem.remove();
      // oldPortfiloItem.images
      return okRes(res, "done");
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async getPortfiloItemByUserId(
    req: Request,
    res: Response
  ): Promise<object> {
    const userId = req.params.userId;
    try {
      const portfiloItems = await PortfiloItem.find({
        where: { user: { id: userId } },
      });
      return okRes(res, portfiloItems);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async getPortfiloItemById(
    req: Request,
    res: Response
  ): Promise<object> {
    const portfiloId = req.params.portfiloId;
    try {
      const portfiloItem = await PortfiloItem.findOne({
        where: { id: portfiloId },
        relations: ["user"],
      });
      portfiloItem.user.hiddenSensitiveInfo();
      return okRes(res, portfiloItem);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  // /**
  //  *
  //  * @param req
  //  * @param res
  //  */
  // static async getService(req, res): Promise<object> {
  //   // let { q } = req.query;
  //   // let { p, s}=req.query;
  //   // let { skip, take } = paginate(p, s);
  //   let id = req.params.serviceId;
  //   let user = req.params.user;

  //   const active = true;
  //   //search
  //   // if (q)
  //   //   whereObj = [
  //   //     {
  //   //       active,
  //   //       user,
  //   //       title: Raw((alias) => `${alias} ILIKE '%${q}%'`),
  //   //     },
  //   //     {
  //   //       active,
  //   //       user,
  //   //       description: Raw((alias) => `${alias} ILIKE '%${q}%'`),
  //   //     },
  //   //   ];
  //   let whereObj = { active, user, id };

  //   try {
  //     let data = await Service.find({
  //       where: whereObj,
  //       relations: ["user"],
  //       // take,
  //       // skip,
  //     });
  //     return okRes(res, { data });
  //   } catch (error) {
  //     return errRes(res, error);
  //   }
  // }

  /**
   *
   * @param req
   * @param res
   */
  //   static async makeInvoice(req, res): Promise<object> {
  //     // validation
  //     let notValid = validate(req.body, validation.makeInvoice());
  //     if (notValid) return errRes(res, notValid);

  //     let ids = [];
  //     for (const iterator of req.body.products) {
  //       let notValid = validate(iterator, validation.oneProduct());
  //       if (notValid) return errRes(res, notValid);
  //       ids.push(iterator.id);
  //     }

  //     // get the user let user = req.user
  //     let user = req.user;

  //     // get the products from DB
  //     let products = await Product.findByIds(ids, { where: { active: true } });

  //     //declaration
  //     [
  //       { id: 1, quantity: 2 },
  //       { id: 2, quantity: 1 },
  //     ];

  //     let total = 0;
  //     //  calculate the total from the products
  //     for (const product of products) {
  //       total =
  //         total +
  //         product.price *
  //           req.body.products.filter((e) => e.id == product.id)[0].quantity;
  //     }

  //     // create the invoice & save
  //     let invoice: any;
  //     invoice = await Invoice.create({
  //       ...req.body,
  //       total,
  //       status: "pending",
  //       user,
  //     });
  //     await invoice.save();

  //     // create ZC things
  //     const paymentData = {
  //       amount: total,
  //       orderId: invoice.id,
  //       serviceType: "Amorii Shop",
  //       redirectUrl: config.zcRedirect,
  //       production: config.zcProduction,
  //       msisdn: config.zcMsisdn,
  //       merchantId: config.zcMerchant,
  //       secret: config.zcSecret,
  //       lang: "ar",
  //     };

  //     let zc = new ZC(paymentData);

  //     let zcTransactionId: any;
  //     try {
  //       zcTransactionId = await zc.init();
  //     } catch (error) {
  //       return errRes(res, error);
  //     }

  //     let url = `https://test.zaincash.iq/transaction/pay?id=${zcTransactionId}`;
  //     invoice.zcTransactionId = zcTransactionId;
  //     await invoice.save();

  //     // create the invoice items
  //     for (const product of products) {
  //       let invoiceItem = await InvoiceItem.create({
  //         quantity: req.body.products.filter((e) => e.id == product.id)[0]
  //           .quantity,
  //         invoice,
  //         subtotal:
  //           req.body.products.filter((e) => e.id == product.id)[0].quantity *
  //           product.price,
  //         product,
  //       });
  //       await invoiceItem.save();
  //     }

  //     return okRes(res, { data: { invoice, url } });
  //   }

  /**
   *
   * @param req
   * @param res
   */
  //   static async zcRedirect(req, res): Promise<object> {
  //     const token = req.query.token;
  //     console.log(token);

  //     let payload: any;
  //     try {
  //       payload = jwt.verify(token, config.zcSecret);
  //     } catch (error) {
  //       return errRes(res, error);
  //     }
  //     console.log(payload);

  //     const id = payload.orderid;

  //     let invoice = await Invoice.findOne(id);

  //     if (!invoice) return errRes(res, "No such invoice");

  //     if (payload.status == "success") {
  //       invoice.status = "paid";
  //       invoice.zcOperation = payload.operationid;
  //       invoice.zcMsisdn = payload.msisdn;
  //       await invoice.save();
  //       return okRes(res, { invoice });
  //     }
  //     invoice.status = payload.status;
  //     invoice.zcOperation = payload.operationid;
  //     invoice.zcMsg = payload.msg;
  //     await invoice.save();

  //     return errRes(res, { data: { invoice } });
  //   }

  /**
   *
   * @param req
   * @param res
   */

  //   static async upload(req: Request, res: Response): Promise<object> {
  //     if (!req.files) return errRes(res, `Image is missing`);
  //     let image = req.files.image;
  //     let fileName = "image";
  //     let path = `./public/${fileName}.png`;
  //     image.mv(path, function (err) {
  //       if (err) return errRes(res, err);
  //       imgbbUploader(config.imageBbUploader, `./public/${fileName}.png`)
  //         .then((r) => {
  //           fs.unlink(path, (error) => errRes(res, error));
  //           return okRes(res, r);
  //         })
  //         .catch((error) => console.error(1));
  //     });
  //   }
}
