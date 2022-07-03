import validate = require("validate.js");
import {
  ExceptionObject,
  handleException,
  handleUnknownError,
  handleVailditionError,
} from "../../helpers/handle_error";
import { okRes } from "../../helpers/tools";
import { msgVaildate } from "../../helpers/validate/msg_vaildate";
import { newRate } from "../../helpers/validate/order.validate";
import { OrderMsg } from "../../src/entity/order/msg_order";
import { Order } from "../../src/entity/order/order";
import { RatingOrder } from "../../src/entity/order/rating";
import { StatusOrder } from "../../src/entity/order/status_enum";
import { NotifictionService } from "../../src/service/notifiction.service";
import { OrderService } from "../../src/service/order.service";

export class OrderController {


  static async rate(req, res): Promise<object> {
    const user = req.user;
    const orderId = req.params.orderId;

    let notValid = validate(req.body, newRate);
    if (notValid) return handleVailditionError(res, notValid);

    try {
      let order = await Order.findOne(orderId, {
        where: {
          active: true,
          consumer: { id: user.id },
        },
      });

      if (!order) return handleException(res, ExceptionObject.NotExist);
      if (order.statuses != StatusOrder.done)
        return handleException(res, ExceptionObject.CantRateUnCompleteOrder);
      const rateOrder = await RatingOrder.create({
        order: order,
        comment: req.body.comment,
        rate: req.body.rate,
      }).save();

      OrderService.handleRating(rateOrder, order);

      return okRes(res, rateOrder);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async doneOrder(req, res): Promise<object> {
    try {
      const user = req.user;
      const orderId = req.params.orderId;
      let order = await Order.findOne(orderId, {
        where: {
          active: true,
          freelancer: { id: user.id },
        },
      });
      if (!order) return handleException(res, ExceptionObject.NotExist);
      order.statuses = StatusOrder.done;
      order = await order.save();
      NotifictionService.sendOrderChangeStatus(order, user, StatusOrder.done);
      OrderService.handleDone(order);
      return okRes(res, order);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async cancelOrder(req, res): Promise<object> {
    try {
      const user = req.user;
      const orderId = req.params.orderId;
      let order = await OrderService.geOrderByUserIdAndOrderId(
        user.id,
        orderId
      );
      if (!order) return handleException(res, ExceptionObject.NotExist);
      //   if (order.freelancerId != user.id && order.consumerId != user.id) {
      //     return handleException(res, ExceptionObject.NotHavePermission);
      //   }
      order.statuses = StatusOrder.cancel;
      order = await order.save();
      NotifictionService.sendOrderChangeStatus(order, user, StatusOrder.cancel);

      return okRes(res, order);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  static async sentMsg(req, res): Promise<object> {
    const user = req.user;
    const orderId = req.params.orderId;
    let notValid = validate(req.body, msgVaildate);
    if (notValid) return handleVailditionError(res, notValid);

    const msg = req.body.msg;
    try {
      let order = await OrderService.geOrderByUserIdAndOrderId(
        user.id,
        orderId
      );
      if (!order) return handleException(res, ExceptionObject.NotExist);
      const orderMsg = await OrderMsg.create({
        msg,
        order: { id: order.id },
        sender: { id: user.id },
      }).save();
      NotifictionService.sendOrderMsg(order, user);
      return okRes(res, orderMsg);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }


  static async getMsg(req, res): Promise<object> {
    const orderId = req.params.orderId;
    const user = req.user;
    try {
      let order = await OrderService.geOrderByUserIdAndOrderId(
        user.id,
        orderId
      );
      if (!order) return handleException(res, ExceptionObject.NotExist);
      const orderMsg = await OrderMsg.find({
        where: { active: true, order: { id: orderId } },
      });
      // if (!orderMsg) return handleException(res, ExceptionObject.NotExist);
      return okRes(res, orderMsg);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }


  static async getOrders(req, res): Promise<object> {
    const user = req.user;
    try {
      let order = await OrderService.geOrderByUserId(user.id);
      if (!order) return handleException(res, ExceptionObject.NotExist);
      return okRes(res, order);
    } catch (error) {
      return handleUnknownError(res, error);
    }
  }

  
}
