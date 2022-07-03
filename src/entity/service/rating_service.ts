import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Service } from "./service";
import { User } from "../user/user";

@Entity()
export class RatingService extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  rate: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  //Relations

  @ManyToOne((type) => Service, (service) => service.rating)
  service: Service;

  @ManyToOne((type) => User, (consumer) => consumer.ratings)
  consumer: User;
}
