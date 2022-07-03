import { Order } from "../entity/order/order";
import { StatusOrder } from "../entity/order/status_enum";
import { Service } from "../entity/service/service";
import { ServiceMsgBox } from "../entity/service/service_msg_box";
import {
  NotifictionItem,
  NotifictionType,
} from "../entity/user/notifiction_item";
import { User } from "../entity/user/user";

export class NotifictionService {
  static createNotifiction(
    reciverId: string,
    type: NotifictionType,
    data: object
  ) {
    NotifictionItem.create({
      type: type,
      data: data,
      userId: reciverId,
    }).save();
  }

  static openServiceMsg(consumer: User, service: Service, box: ServiceMsgBox) {
    this.createNotifiction(service.userId, NotifictionType.openserviceboxmsg, {
      serviceId: service.id,
      servicetitle: service.title,
      consumer: consumer.id,
      consumerName: consumer.name,
      boxId: box.id,
    });
  }

  static sendServiceMsg(box: ServiceMsgBox, sender: User) {
    const reciverId =
      box.consumerId == sender.id ? box.freelancerId : box.consumerId;

    this.createNotifiction(reciverId, NotifictionType.reciveservicemsg, {
      boxId: box.id,
      senderId: sender.id,
      serviceName: box.service.title,
      serviceId: box.serviceId,
      senderName: sender.name,
    });
  }

  static sendOrderMsg(order: Order, sender: User) {
    const reciverId =
      order.consumerId == sender.id ? order.freelancerId : order.consumerId;

    this.createNotifiction(reciverId, NotifictionType.reciveorderemsg, {
      orderId: order.id,
      senderId: sender.id,
      orderTitle: order.title,
      senderName: sender.name,
    });
  }

  static sendOrderChangeStatus(
    order: Order,
    sender: User,
    status: StatusOrder
  ) {
    const reciverId =
      order.consumerId == sender.id ? order.freelancerId : order.consumerId;

    this.createNotifiction(reciverId, NotifictionType.changeorderstatus, {
      orderId: order.id,
      senderId: sender.id,
      orderTitle: order.title,
      senderName: sender.name,
      status: status,
    });
  }
}
