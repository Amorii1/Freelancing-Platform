import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  JoinTable,
} from "typeorm";
import { Service } from "./service/service";

@Entity("categories")
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  arTitle: string;
  @Column()
  enTitle: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column()
  active: boolean;

  // @Column()
  // @CreateDateColumn()
  // createdAt: Date;

  // @Column()
  // @UpdateDateColumn()
  // updateddAt: Date;

  //Relations
  @OneToMany(type => Service,service=>service.category) 
  service:Service;

  @ManyToOne(type => Category, category => category.children)
  parent: Category;

  @Column({nullable:true})
  parentId:number;

  @OneToMany(type => Category, category => category.parent)
  children: Category[];
}
