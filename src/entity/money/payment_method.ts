import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Order } from "../order/order";
import { PaymentMethodType } from "./payment_method_enum";

@Entity()
export class PaymentMethod extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    // enum: PaymentMethodType,
  })
  paymentMethod: PaymentMethodType;

  @Column()
  min: number;

  @Column()
  max: number;

  @Column()
  active: boolean;

  // @OneToMany((type) => Order, (order) => order.method)
  // orders: Order[];
}
