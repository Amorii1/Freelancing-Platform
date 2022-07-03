import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToOne,
    ManyToOne,
    UpdateDateColumn,
    ManyToMany,
  } from "typeorm";
  import { Service } from "./service";
import { ServiceOrder } from "./service_order";
  
  @Entity()
  export class ServicePackage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    description?: string;

    @Column()
    moreCost : number;

    @Column()
    moreDuration : number;

    @Column({default:true})
    active : boolean;

    //Relations
  
    @ManyToOne((type) => Service, (service) => service.packages)
    service: Service;
  
    @ManyToMany((type)=>ServiceOrder,(serviceOrder)=> serviceOrder.packages )
    serviceOrder:[];
    

  }
  