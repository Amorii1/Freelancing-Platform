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
  RelationId,
} from "typeorm";
import { User } from "../user/user";
import { ServiceMsgBox } from "./service_msg_box";

@Entity()
export class ServiceMsg extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({default:true})
  active: boolean;

  @RelationId("sender")
  senderId:string;

  @Column()
  msg: string;

  @ManyToOne((type) => ServiceMsgBox, (msgBox) => msgBox.msg)
  msgBox: ServiceMsgBox;

  @ManyToOne((type) => User, (consumer) => consumer.ratings)
  sender: User;
}
