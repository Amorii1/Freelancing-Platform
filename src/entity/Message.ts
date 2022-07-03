import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, ManyToOne} from "typeorm";
import { MessageBox } from "./messageBox";

@Entity("messages")
export class Message extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    active: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @CreateDateColumn()
    updateddAt: Date;

    //Relations

    @ManyToOne((type)=>MessageBox, (box)=>box.messages)
    box: MessageBox;


}