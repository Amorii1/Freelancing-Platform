import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, OneToOne, OneToMany} from "typeorm";
import { Offer } from "./Offer";

@Entity("projects")
export class Project extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    duration: number;

    @Column()
    cost: number;

    @Column()
    active: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @CreateDateColumn()
    updateddAt: Date;

    //Relations

    @OneToMany((type)=>Offer, (offer)=>offer.project)
    offers: Offer[];

}