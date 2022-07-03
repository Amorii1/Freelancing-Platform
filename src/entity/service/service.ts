import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToOne,
  OneToMany,
  RelationId,
} from "typeorm";
import { Category } from "../Category";
import { Order } from "../order/order";
import { RatingService } from "./rating_service";
import { User } from "../user/user";
import { ServicePackage } from "./service_package";
import { ServiceMsgBox } from "./service_msg_box";
import { ServiceOrder } from "./service_order";

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('varchar',{ array:true , nullable:true})
  images: string[];

  @Column()
  description: string;

  @Column({type:"int"})
  duration: number; // in days 

  @Column({type:"int"})
  cost: number;

  @Column({default:true})
  active: boolean;

  @Column({default:true})
  isReciving: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @CreateDateColumn()
  updatedAt: Date;

  @Column({type:"int" , default:0})
  rateSum : number;

  @Column({type:"int" , default:0})
  rateNum : number;

  @Column({type:"int" , default:0})
  sellerNum : number;

  @RelationId((service:Service)=>service.user )
  userId:string;

  //Relations

  @ManyToOne((type) => Category, (category) => category.service )
  category: Category;

  
  @ManyToOne((type) => User, (user) => user.services)
  user: User;

  
  @OneToOne((type) => RatingService, (rating) => rating.service)
  rating: RatingService[];

  @OneToMany((type) => ServicePackage, (packages) => packages.service )
  packages: ServicePackage[];

  @OneToMany((type) => ServiceMsgBox, (msgBox) => msgBox.service )
  msgBox: ServiceMsgBox[];
  
  @OneToMany((type) => ServiceOrder, (order) => order.service)
  orders: ServiceOrder[];
}
