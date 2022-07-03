import { Order, OrderType } from "../entity/order/order";
import { RatingOrder } from "../entity/order/rating";
import { ServiceService } from "./service.service";

export class OrderService {
  static async geOrderByUserIdAndOrderId(
    userid: number,
    orderId: number
  ): Promise<Order> {
    return await Order.findOne(orderId, {
      where: [
        {
          active: true,
          freelancer: { id: userid },
        },
        {
          active: true,
          consumer: { id: userid },
        },
      ],
    });
  }

  static async geOrderByUserId(userid: number): Promise<Order[]> {
    return await Order.find({
      where: [
        {
          active: true,
          freelancer: { id: userid },
        },
        {
          active: true,
          consumer: { id: userid },
        },
      ],
    });
  }

  static async handleRating(rate : RatingOrder , order : Order){
    if(order.type == OrderType.service ){
      ServiceService.rate(rate,order);
    } else {
      throw "unimplemets rate project";
    }
}

static async handleDone( order : Order){
  if(order.type == OrderType.service ){
    ServiceService.done(order);
  } else {
    throw "unimplemets rate project";
  }
}
}
