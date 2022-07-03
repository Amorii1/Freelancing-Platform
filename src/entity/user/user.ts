import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
  UpdateDateColumn,
  Double,
  ManyToMany,
  JoinTable,
  Unique,
  PrimaryColumn,
} from "typeorm";
import { Offer } from "../Offer";
import { PortfiloItem } from "./portfilo_item";
import { RatingService } from "../service/rating_service";
import { Service } from "../service/service";
import { ServiceMsg } from "../service/service_msg";
import { ServiceMsgBox } from "../service/service_msg_box";
import { Proficiency } from "./proficiency_enum";
import { Skills } from "./skills";
import { Order } from "../order/order";
import { OrderMsg } from "../order/msg_order";

@Entity("users")
export class User extends BaseEntity {
  // @PrimaryGeneratedColumn("uuid")
  @PrimaryColumn()
  id: string;

  // @Column({unique:true,nullable:false})
  // firebaseid:string

  @Column({nullable:true})
  picture:string

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;
 
  @Column({ unique: true , select:false  , nullable:true}) 
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  complete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @CreateDateColumn()
  lastSeen: Date;

  // @Column({ nullable: true })
  // facebookId: string;

  // @Column({ nullable: true })
  // googleId: string;

  @Column({ type: "float", default: 0 })
  rate: number;
  @Column({ type: "int", default: 0 })
  completedProject: number;

  @Column({ type: "int", default: 0 })
  completedService: number;

  @Column({ nullable: true })
  city: string;

  @Column({ type: "enum", nullable: true, enum: Proficiency })
  proficiency: Proficiency;
  //Relations

  @OneToMany((type) => Service, (service) => service.user)
  services: Service[];

  @OneToMany((type) => RatingService, (rating) => rating.consumer)
  ratings: RatingService[];

  @OneToMany((type) => ServiceMsg, (serviceMsgs) => serviceMsgs.sender)
  serviceMsgs: ServiceMsg[];

  @OneToMany((type) => OrderMsg, (orderMsg) => orderMsg.sender)
  orderMsg: OrderMsg[];

  @OneToMany(
    (type) => ServiceMsgBox,
    (serviceMsgBoxs) => serviceMsgBoxs.freelancer
  )
  serviceMsgBoxsAsFreelancer: ServiceMsgBox[];

  @OneToMany(
    (type) => ServiceMsgBox,
    (serviceMsgBoxs) => serviceMsgBoxs.consumer
  )
  serviceMsgBoxsAsConsumer: ServiceMsgBox[];



  @OneToMany(
    (type) => Order,
    (order) => order.freelancer
  )
  orderAsFreelancer: Order[];

  @OneToMany(
    (type) => Order,
    (order) => order.consumer
  )
  orderAsConsumer: Order[];

  @OneToMany((type) => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany((type) => PortfiloItem, (item) => item.user)
  portfiloItems: PortfiloItem[];

  @ManyToMany((type) => Skills, (skill) => skill.users)
  @JoinTable({
    name: "users_skills_skills",
    joinColumn: {
      name: "userId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "skillName",
      referencedColumnName: "name",
    },
  })
  skills: Skills[];

  hiddenSensitiveInfo() {
    delete this.phone;
    // delete this.googleId;
    // delete this.facebookId;
  }
}
