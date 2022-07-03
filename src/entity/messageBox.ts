import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Message } from "./Message";

@Entity("messageBoxes")
export class MessageBox extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  active: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @CreateDateColumn()
  updateddAt: Date;

  @OneToMany((type) => Message, (message) => message.box)
  messages: Message[];
}
