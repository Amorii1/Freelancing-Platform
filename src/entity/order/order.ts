import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import { PaymentMethod } from "../money/payment_method";
import { Project } from "../Project";
import { Service } from "../service/service";
import { ServiceOrder } from "../service/service_order";
import { User } from "../user/user";
import { OrderMsg } from "./msg_order";
import { RatingOrder } from "./rating";
import { StatusOrder } from "./status_enum";

export enum OrderType {
  project = "project",
  service = "service",
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  duration: number;

  @Column({ nullable: false })
  cost: number;

  @Column({ default: true })
  active: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  title: string;

  @Column()
  @CreateDateColumn()
  updateddAt: Date;

  @OneToOne((type)=>RatingOrder, (rate)=>rate.order )
  rate : RatingOrder;

  @Column({
    type: "enum",
    enum: StatusOrder,
    default: StatusOrder.inProgress,
    nullable: false,
  })
  statuses: StatusOrder;

  @Column({
    type: "enum", 
    enum: OrderType,
    nullable: true,
  })
  type: OrderType;

  @RelationId((order: Order) => order.freelancer)
  freelancerId: string;

  @RelationId((order: Order) => order.consumer)
  consumerId: string;

  @ManyToOne((type) => User, (consumer) => consumer.orderAsConsumer, {
    nullable: false,
  })
  consumer: User;

  @ManyToOne((type) => User, (freelancer) => freelancer.orderAsFreelancer, {
    nullable: false,
  })
  freelancer: User;

  @OneToOne((type) => ServiceOrder, { cascade: true })
  // @JoinColumn()
  serviceOrder: ServiceOrder;

  @OneToOne((type) => Project)
  project: Project;

  //Relations

  // @ManyToOne((type) => PaymentMethod,(method)=>method.orders )
  // method: PaymentMethod;

  @OneToMany((type) => OrderMsg, (msg) => msg.order)
  msgs: OrderMsg[];
}
