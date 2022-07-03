import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  RelationId,
} from "typeorm";
import { Service } from "./service";
import { Order } from "../order/order";
import { ServicePackage } from "./service_package";

@Entity()
export class ServiceOrder extends BaseEntity {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @RelationId("service")
  serviceId : number

  @ManyToOne((type) => Service, (service) => service.orders , {nullable:false , primary : true})
  service: Service;

  @OneToOne((type) => Order , {cascade : true , nullable:false  , primary : true})
  @JoinColumn()
  order: Order;

  @ManyToMany((type) => ServicePackage, (packages) => packages.serviceOrder)
  @JoinTable()
  packages: ServicePackage[];
}
