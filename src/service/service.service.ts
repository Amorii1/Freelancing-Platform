import { Order } from "../entity/order/order";
import { RatingOrder } from "../entity/order/rating";
import { Service } from "../entity/service/service";
import { ServiceOrder } from "../entity/service/service_order";

export class ServiceService {
  static findById(id: number): Promise<Service> {
    return Service.findOne(id, { where: { active: true } });
  }

  static async rate(rate: RatingOrder, order: Order) {
    const serviceOrder = await ServiceOrder.findOne({
      order: { id: order.id },
    });
    Service.createQueryBuilder()
      .update({ id: serviceOrder.serviceId })
      .set({
        rateSum: () => `rateSum + ${rate.rate} `,
        rateNum: () => `rateNum + 1 `,
      });
  }

  static async done(order: Order) {
    const serviceOrder = await ServiceOrder.findOne({
      order: { id: order.id },
    });
    Service.createQueryBuilder()
      .update({ id: serviceOrder.serviceId })
      .set({
        sellerNum: () => `sellerNum + 1`,
      });
  }
}
