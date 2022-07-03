import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity} from "typeorm";

@Entity("admins")
export class Admin extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique:true})
    phone: number;

    @Column({unique:true})
    email: string;

    @Column()
    password: string;

    @Column()
    resetPassword: string;

    @Column()
    tries: number;

    @Column()
    otp: number;

    @Column()
    active: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @CreateDateColumn()
    updateddAt: Date;

}