import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { User } from "./user";

export enum NotifictionType {
  openserviceboxmsg="openserviceboxmsg",
  reciveservicemsg="reciveservicemsg",
  reciveorderemsg="reciveorderemsg",
  changeorderstatus="changeorderstatus"
}

@Entity()
export class NotifictionItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("json")
  data: {};

  @Column({ type: "enum", enum: NotifictionType })
  type: NotifictionType;

  @RelationId((item: NotifictionItem) => item.user)
  userId: string;

  @ManyToOne((type) => User, (user) => user.portfiloItems)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

}
