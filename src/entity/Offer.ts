import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, ManyToOne} from "typeorm";
import { Project } from "./Project";
import { User } from "./user/user";

@Entity("offers")
export class Offer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    duration: number;

    @Column()
    cost: number;

    @Column()
    comment: string;

    @Column()
    active: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @CreateDateColumn()
    updateddAt: Date;

    //Relations

    @ManyToOne((type)=>Project, (project)=>project.offers)
    project: Project;

    @ManyToOne((type)=>User, (user)=>user.offers)
    user: User;


}