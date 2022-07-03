import validate = require("validate.js");
import {
  ExceptionObject,
  handleException,
  handleUnknownError,
  handleVailditionError,
} from "../../helpers/handle_error";
import { okRes, paginate } from "../../helpers/tools";
import { msgVaildate } from "../../helpers/validate/msg_vaildate";
import { MessageBox } from "../../src/entity/messageBox";
import { Service } from "../../src/entity/service/service";
import { ServiceMsg } from "../../src/entity/service/service_msg";
import { ServiceMsgBox } from "../../src/entity/service/service_msg_box";
import { NotifictionType } from "../../src/entity/user/notifiction_item";
import { NotifictionService } from "../../src/service/notifiction.service";

export default class MsgServiceController {
  static async createBox(req, res): Promise<object> {
    const user = req.user;
    const serviceId = req.params.serviceId;

    const service = await Service.findOne({
      where: { id: serviceId, active: true, isReciving: true },
      relations: ["user"],
    });

    if (!service) return handleException(res, ExceptionObject.ServiceNotExist);
    console.log(service);
    if (service.userId == user.id)
      return handleException(res, ExceptionObject.NotHavePermission);
    service?.user?.hiddenSensitiveInfo();
    try {
      let newBox = ServiceMsgBox.create({
        freelancer: { id: service.user.id },
        consumer: { id: user.id },
        service: { id: service.id },
      });
      newBox = await newBox.save();
      NotifictionService.openServiceMsg(user, service, newBox);
      delete newBox.service;
      delete newBox.consumer;
      delete newBox.freelancer;

      return okRes(res, newBox);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async getBoxsByServiceIdAndFreeLancerId(req, res): Promise<object> {
    const user = req.user;
    const serviceId = req.params.serviceId;

    try {
      let boxs = await ServiceMsgBox.find({
        where: {
          service: { id: serviceId },
          freelancer: { id: user.id },
        },
        relations: ["service", "consumer"],
      });

      return okRes(res, boxs);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async getBoxsByUserId(req, res): Promise<object> {
    const user = req.user;
    try {
      let boxs = await ServiceMsgBox.find({
        where: [
          {
            freelancer: { id: user.id },
          },
          {
            consumer: { id: user.id },
          },
        ],
        relations: ["service", "freelancer", "consumer"],
      });

      return okRes(res, boxs);
    } catch (error) {
      console.error(error);
      return handleUnknownError(res, error);
    }
  }

  static async getMsgByBoxId(req, res): Promise<object> {
    const user = req.user;
    const boxId = req.params.boxId;
    const { page, skip } = req.query;
    let { skip: _skip, take } = paginate(page, skip);

    try {
      const box = await ServiceMsgBox.findOne({
        where: { id: boxId, active: true },
      });
      if (!box) return handleException(res, ExceptionObject.NotExist);

      if (![box.consumerId, box.freelancerId].includes(user.id)) {
        return handleException(res, ExceptionObject.NotHavePermission);
      }

      let msgs = await ServiceMsg.find({
        where: {
          msgBox: { id: boxId },
        },
        take: take,
        skip: skip,
      });

      return okRes(res, msgs);
    } catch (error) {
      console.error(error);
      return handleUnknownError(res, error);
    }
  }

  static async getBoxsByConsumerIdAndServiceId(req, res): Promise<object> {
    const user = req.user;
    const serviceId = req.params.serviceId;

    try {
      let boxs = await ServiceMsgBox.find({
        where: {
          service: { id: serviceId },
          consumer: { id: user.id },
        },
        relations: ["service", "freelancer"],
      });

      return okRes(res, boxs);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async sendMsg(req, res): Promise<object> {
    let notValid = validate(req.body, msgVaildate);    
    if (notValid) return handleVailditionError(res, notValid);

    const msg = req.body.msg;
    const msgBoxId = req.params.boxId;
    const user = req.user;
    try {
      const box = await ServiceMsgBox.findOne({
        where: { id: msgBoxId, active: true },
        relations: ["service"],
      });
      if (!box) return handleException(res, ExceptionObject.NotExist);

      if (![box.consumerId, box.freelancerId].includes(user.id)) {
        return handleException(res, ExceptionObject.NotHavePermission);
      }

      let msgEntity = ServiceMsg.create({
        msgBox: { id: box.id },
        sender: { id: user.id },
        msg: msg,
      });
      NotifictionService.sendServiceMsg(box, user);
      await msgEntity.save();
      return okRes(res, msgEntity);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }
}
