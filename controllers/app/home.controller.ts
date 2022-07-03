// import { Request, Response } from "express";
import {  okRes, } from "../../helpers/tools";
import { Category } from "../../src/entity/Category";
// import { Invoice } from "../../src/entity/Invoice";
// import { Method } from "../../src/entity/Method";
// import { Product } from "../../src/entity/Product";
// import * as fs from "fs";
// import * as imgbbUploader from "imgbb-uploader";
import { IsNull, Like, Raw } from "typeorm";
import { Service } from "../../src/entity/service/service";
import { handleUnknownError } from "../../helpers/handle_error";
import { Skills } from "../../src/entity/user/skills";
/**
 *
 */
export default class HomeController {
  /**
   *
   * @param req
   * @param res
   */
  static async getCategories(req, res): Promise<object> {
    let { text } = req.query;

    try {
      let queryBuilder = Category.createQueryBuilder().select();
      queryBuilder = queryBuilder.where(`"Category"."active"`);

      if (text) {
        queryBuilder = queryBuilder.andWhere(
          `"Category"."arTitle" LIKE :text OR "Category"."enTitle" LIKE :text `,
          { text : `%${text}%` }
        );
      } else {
        queryBuilder = queryBuilder.andWhere(`"Category"."parentId" Is NULL`);
      }

      queryBuilder = queryBuilder.leftJoinAndSelect(
        "Category.children",
        "children",
        "children.active"
      );

      let data = await queryBuilder.getMany();
      return okRes(res, data);
      
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  static async getSkills(req, res): Promise<object> {
    try {
      let data = await Skills.find();
      return okRes(
        res,
        data.map((skill) => skill.name)
      );
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  //   static async getMethods(req, res): Promise<object> {
  //     try {
  //       let data = await Method.find({
  //         where: { active: true },
  //       });
  //       return okRes(res, { data });
  //     } catch (error) {
  //       return errRes(res, error);
  //     }
  //   }

  /**
   *
   * @param req
   * @param res
   */
  //   static async getInvoices(req, res): Promise<object> {
  //     try {
  //       let data = await Invoice.find({
  //         where: { user: req.user },
  //         join: {
  //           alias: "invoice",
  //           leftJoinAndSelect: {
  //             user: "invoice.user",
  //             items: "invoice.items",
  //             product: "items.product",
  //           },
  //         },
  //       });
  //       return okRes(res, { data });
  //     } catch (error) {
  //       return errRes(res, error);
  //     }
  //   }
  /**
   *
   * @param req
   * @param res
   */

  //   static async uploadImg(req: Request, res: Response): Promise<object> {
  //     if (!req.files) return errRes(res, `image is not found`);
  //     let fileName = `image`;
  //     let image = req.files.image;
  //     let path = `./public/${fileName}.png`;
  //     image.mv(path, function (err) {
  //       if (err) return errRes(res, "error");
  //       imgbbUploader("imageBbUploader", path)
  //         .then((response) => {
  //           fs.unlink(path, (error) => errRes(res, error));
  //           return okRes(res, response);
  //         })
  //         .catch((error) => console.error(1));
  //     });
  //     return okRes(res, "good");
  //   }
}
