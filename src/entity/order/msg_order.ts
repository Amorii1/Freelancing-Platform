import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "../user/user";
import { Order } from "./order";

@Entity()
export class OrderMsg extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({default:true})
  active: boolean;

  @Column({nullable:false})
  msg: string;

  @ManyToOne((type) => Order, (order) => order.msgs,{nullable:false})
  order: Order;

  @ManyToOne((type) => User, (user) => user.orderMsg,{nullable:false})
  sender: User;
}
