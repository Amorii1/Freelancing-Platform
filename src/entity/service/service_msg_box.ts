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
import { Service } from "./service";
import { User } from "../user/user";
import { ServiceMsg } from "./service_msg";

@Entity()
export class ServiceMsgBox extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @RelationId((box: ServiceMsgBox) => box.consumer)
  consumerId: string;

  @RelationId((box: ServiceMsgBox) => box.freelancer)
  freelancerId: string;

  @RelationId((box: ServiceMsgBox) => box.service)
  serviceId: number;

  //Relations

  @ManyToOne((type) => Service, (service) => service.msgBox, {
    nullable: false,
  })
  service: Service;

  @OneToMany((type) => ServiceMsg, (msg) => msg.msgBox, { nullable: false })
  msg: ServiceMsg[];

  @ManyToOne((type) => User, (consumer) => consumer.serviceMsgBoxsAsConsumer, {
    nullable: false,
  })
  consumer: User;

  @ManyToOne(
    (type) => User,
    (freelancer) => freelancer.serviceMsgBoxsAsFreelancer,
    { nullable: false }
  )
  freelancer: User;
}
