import { Not, IsNull, Raw, QueryFailedError, In } from "typeorm";

import validate = require("validate.js");
import { okRes, paginate } from "../../helpers/tools";
import { Category } from "../../src/entity/Category";
import { Service } from "../../src/entity/service/service";
import validation from "../../helpers/validation.helper";
import {
  ExceptionObject,
  handleException,
  handleUnknownError,
  handleVailditionError,
} from "../../helpers/handle_error";
import { constVal } from "../../helpers/const_val";
import { ServicePackage } from "../../src/entity/service/service_package";
import { ServiceOrder } from "../../src/entity/service/service_order";
import { newOrder } from "../../helpers/validate/order.validate";
import { OrderService } from "../../src/service/order.service";

export default class ServiceController {
  /**
   *
   * @param req
   * @param res
   */
  static async getServiceById(req, res): Promise<object> {
    let id = req.params.id;
    let whereObj = { active: true, id };

    try {
      let data = await Service.findOne({
        where: whereObj,
        relations: ["user", "packages", "category"], //TODO:: query builder
      });

      if (!data) return handleException(res, ExceptionObject.NotExist);
      data?.user?.hiddenSensitiveInfo();
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

  static async createService(req, res): Promise<object> {
    //validation
    let notValid = validate(req.body, validation.newService());
    if (notValid) return handleVailditionError(res, notValid);

    //check existence
    let newService: Service;
    try {
      // newService.packages
      newService = await Service.findOne({ where: { title: req.body.title } });
      if (newService)
        return handleException(res, ExceptionObject.TitleAlreadyExist);
      /// handle it in diff way
    } catch (error) {
      return handleUnknownError(res, error);
    }

    //get user
    let user = req.user;

    //get subcategory
    let subcategory = await Category.findOne({
      where: { id: req.body.categoryId, active: true, parentId: Not(IsNull()) },
    });
    if (!subcategory)
      return handleException(res, ExceptionObject.SubCategoryNotExist);

    // create new service
    try {
      newService = await Service.create({
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        cost: req.body.cost,
        category: subcategory,
        user: user,
        images: req.body.images,
        packages: req.body.packages,
      });
      await newService.save();
      return okRes(res, newService);
    } catch (error) {
      return handleUnknownError(res, error);
    }
    // return okRes(res, newService);
  }
  /**
   *
   * @param req
   * @param res
   */
  static async editService(req, res): Promise<object> {
    const user = req.user;
    //validation
    let notValid = validate(req.body, validation.editService());
    if (notValid) return handleVailditionError(res, notValid);
    //get service
    let editService = await Service.findOne({
      where: { id: req.params.id, active: true, user },
    });

    if (req.body.categoryId) {
      //get subcategory
      let category = await Category.findOne({
        where: {
          id: req.body.categoryId,
          active: true,
          parent: { id: Not(IsNull()) },
        },
      });
      if (!category)
        return handleException(res, ExceptionObject.PickSubCategory);
    }
    //edit service
    try {
      if (req.body.description) editService.description = req.body.description;
      if (req.body.cost) editService.cost = req.body.cost;
      if (req.body.duration) editService.duration = req.body.duration;
      if (req.body.category) editService.category = req.body.category;
      if (req.body.images) editService.images = req.body.images;
      if (req.body.title) editService.title = req.body.title;

      if (req.body.isReciving != undefined)
        editService.isReciving = req.body.isReciving;
      await editService.save();
    } catch (error) {
      return handleUnknownError(res, error);
    }
    return okRes(res, editService);
  }

  static async addPackage(req, res): Promise<object> {
    const user = req.user;

    const serviceId = req.params.id;
    //validation
    let notValid = validate(req.body, validation.newPackage());
    if (notValid) return handleVailditionError(res, notValid);

    try {

      const service = await Service.findOne({ where: { user, id: serviceId } });
      if (!service)
        return handleException(res, ExceptionObject.ServiceNotExist);
      const packages = (req.body.packages as Array<ServicePackage>).map(
        (val) => {
          val.service = service;
          return val;
        }
      );
      const newPackages = await ServicePackage.save(packages);
      return okRes(res, newPackages);

    } catch (error) {
      return handleUnknownError(res, error);
    }

    // Service.create()
  }

  static async editPackage(req, res): Promise<object> {
    const user = req.user;

    const packageId = req.params.id;
    let notValid = validate(req.body, validation.editPackage());
    if (notValid) return handleVailditionError(res, notValid);

    try {
      // newService.packages
      const packages = await ServicePackage.findOne({
        where: { id: packageId },
        relations: ["service"],
      });
      if (!packages || packages.service.userId != user.id)
        return handleException(res, ExceptionObject.NotExist);
      packages.description = req.body.description;
      packages.moreDuration = req.body.moreDuration;
      packages.moreCost = req.body.moreCost;

      await packages.save();

      return okRes(res, packages);
    } catch (error) {
      return handleUnknownError(res, error);
    }

    // Service.create()
  }

  static async deletePackage(req, res): Promise<object> {
    const user = req.user;
    const packageId = req.params.id;
    //validation
    // let notValid = validate(req.body, validation.newPackage(false));
    // if (notValid) return handleVailditionError(res, notValid);

    try {
      // newService.packages
      const packages = await ServicePackage.findOne({
        where: { id: packageId },
        relations: ["service"],
      });
      if (!packages || packages.service.userId != user.id)
        return handleException(res, ExceptionObject.NotExist);
      packages.active = false;
      await packages.save();
      // service
      // const packages = (req.body.packages as Array<ServicePackage>).map(
      //   (val) => {
      //     val.service = service;
      //     return val;
      //   }
      // );
      // const newPackages = await ServicePackage.save(packages);
      return okRes(res, "Deleted Succefully");
      // const serviceNew  = {id:serviceId ,packages  };
      // Service.save(serviceNew);
      // service.packages.push
    } catch (error) {
      return handleUnknownError(res, error);
    }

    // Service.create()
  }
  /**
   *
   * @param req
   * @param res
   */
  static async deleteService(req, res): Promise<object> {
    let user = req.user;
    //get service

    try {
      let deleteService = await Service.findOne({
        where: { id: req.params.id, active: true, user },
      });
      if (!deleteService)
        return handleException(res, ExceptionObject.ServiceNotExist);
      deleteService.active = false;
      await deleteService.save();
      return okRes(res, { msg: "Service Deleted Succefully" });
    } catch (error) {
      console.log(error);
      return handleUnknownError(res, error);
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  static async getServicesByQuery(req, res): Promise<object> {
    if (req.query.subcategoryids) {
      req.query.subcategoryids = req.query.subcategoryids.split(",");
    }
    let notValid = validate(req.query, validation.queryService());
    if (notValid) return handleVailditionError(res, notValid);

    let {
      page,
      skip,
      text,
      rate,
      costfrom,
      costto,
      categoryid,
      subcategoryids,
    } = req.query;

    let { skip: _skip, take } = paginate(page, skip);

    const subCategoryWhere = "Service.categoryId IN (:...subcategoryids)";
    const categoryWhere =
      'Service.categoryId IN (SELECT id FROM categories WHERE "categories"."parentId" = :categoryid)';

    let queryBuilder = Service.createQueryBuilder();
    queryBuilder = queryBuilder.where("Service.active=true");

    if (categoryid && subcategoryids) {
      queryBuilder = queryBuilder.andWhere(
        `${subCategoryWhere}  OR ${categoryWhere}`,
        {
          categoryid,
          subcategoryids,
        }
      );
    } else if (subcategoryids) {
      queryBuilder = queryBuilder.andWhere(`${subCategoryWhere}`, {
        subcategoryids,
      });
    } else if (categoryid)
      queryBuilder = queryBuilder.andWhere(`${categoryWhere}`, { categoryid });

    if (text)
      queryBuilder = queryBuilder.andWhere(
        `"Service"."title" ILIKE :text OR "Service"."description" ILIKE :text`,
        { text: `%${text}%` }
      );
    if (rate)
      queryBuilder = queryBuilder.andWhere('"Service"."rate" =:rate', { rate });
    if (costfrom || costto) {
      costfrom ??= constVal.mincost;
      costto ??= constVal.maxcost;
      queryBuilder = queryBuilder.andWhere(
        `"Service"."cost" BETWEEN :costfrom AND :costto`,
        {
          costfrom,
          costto,
        }
      );
    }

    if (_skip > 0) {
      queryBuilder = queryBuilder.offset(_skip);
    }

    queryBuilder = queryBuilder.take(take);

    queryBuilder = queryBuilder.leftJoinAndSelect(
      "Service.category",
      "category"
    );

    queryBuilder = queryBuilder.leftJoinAndSelect(
      "Service.packages",
      "ServicePackage",
      "ServicePackage.active"
    );

    queryBuilder = queryBuilder.leftJoinAndSelect("Service.user", "user");

    try {
      let services = await queryBuilder.getMany();
      return okRes(res, services);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async orderService(req, res): Promise<object> {
    // const
    const user = req.user;
    const serviceId = req.params.serviceId;
    let notValid = validate(req.body, newOrder);

    if (notValid) return handleVailditionError(res, notValid);

    const packagesIdSet = req.body.packagesId
      ? new Set(req.body.packagesId)
      : null;
    if (packagesIdSet?.size != req.body.packagesId?.length)
      return handleException(res, ExceptionObject.UsedDuplicitedPackageId);

    let service: Service;

    try {
      service = await Service.findOne(serviceId, {
        where: {
          active: true,
          user: { id: Not(user.id) },
        },
        relations: packagesIdSet ? ["packages"] : null,
      });

      if (!service)
        return handleException(res, ExceptionObject.ServiceNotExist);
    } catch (error) {
      console.log(error);
      return handleUnknownError(res, error);
    }
    try {
      // make sure all packages exist in service and calc durnation and cost ;
      let cost = service.cost;
      let duration = service.duration;
      let packages = [];
      if (packagesIdSet)
        try {
          packagesIdSet.forEach((p) => {
            const _package = service.packages.find((val) => val.id == p);
            if (_package?.active) { // TODO:: test it / we could select only active with query builder  //TODO:: query builder
              cost += _package.moreCost;
              duration += _package.moreDuration;
              packages.push(_package);
            } else {
              throw ExceptionObject.PackageNotExist;
            }
          });
        } catch (error) {
          if (error == ExceptionObject.PackageNotExist)
            return handleException(res, ExceptionObject.PackageNotExist);

          console.log(error);
          return handleUnknownError(res, error);
        }

      const order = await ServiceOrder.create({
        service: { id: serviceId },
        packages: packages,
        order: {
          cost: cost,
          duration: duration,
          title : service.title,
          consumer: user,
          freelancer: { id: service.userId },
        },
      }).save();
      return okRes(res, order);
    } catch (error) {
      console.log(error);
      return handleUnknownError(res, error);
    }
    // const order = OrderService.createOrder(
    //   req.cost,
    //   req.duration,

    // );

    // return;
  }

  static async getorderServiceAsFreelancer(req, res): Promise<object> {
    const user = req.user;
    const serviceId = req.params.serviceId;

    try {

      const service = await Service.findOne(serviceId, {
        where: {
          active: true,
          user: { id: user.id },
        },
      });

      if (!service)
        return handleException(res, ExceptionObject.ServiceNotExist);

      const serviceOrders = await ServiceOrder.find({
        where: {
          service: service,
        },
        relations: ["order", "packages"],
      });

      return okRes(res, serviceOrders);
    } catch (error) {
      console.log(error);
      return handleUnknownError(res, error);
    }
  }
}
