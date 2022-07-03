import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { User } from "./user";
@Entity()
export class Skills extends BaseEntity {

  @PrimaryColumn()
  name: string;


  @ManyToMany((type) => User, (user) => user.skills)
  users: User[];

}
