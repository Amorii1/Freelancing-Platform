import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  RelationId,
} from "typeorm";
import { Service } from "../service/service";
import { User } from "../user/user";
import { Order } from "./order";

@Entity()
export class RatingOrder extends BaseEntity {
  @PrimaryColumn()
  @RelationId("order")
  orderId: number;

  @OneToOne(
    // primary key
    (type) => Order,
    (order) => order.rate,
    {
      primary: true,
    }
  ) // same as order id
  order: Order;

  @Column()
  comment: string;

  @Column()
  rate: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  //Relations

  // @ManyToOne((type) => Service, (service) => service. )
  // service: Service;

  // @ManyToOne((type) => User, (consumer) => consumer.ratings)
  // consumer: User;
}
