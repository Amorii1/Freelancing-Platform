import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { User } from "./user";
@Entity()
export class PortfiloItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar',{ array:true , nullable:true})
  images: string[];

  @Column()
  description: string;

  @Column({unique:true})
  title: string;

  @Column({ nullable: true })
  link: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @RelationId((item:PortfiloItem)=>item.user)
  userId: string;

  @ManyToOne((type) => User, (user) => user.portfiloItems)
  user: User;


}
