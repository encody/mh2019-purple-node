import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { Routable } from "../route";

@Entity()
export class User extends Routable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 255,
        unique: true,
    })
    userName: string;

    @Column({
        type: 'varbinary',
        length: 32,
    })
    pass: Buffer;

    @Column({
        type: 'varbinary',
        length: 32,
    })
    salt: Buffer;

    @UpdateDateColumn()
    ts: Date;

    @CreateDateColumn()
    dt: Date;
}
