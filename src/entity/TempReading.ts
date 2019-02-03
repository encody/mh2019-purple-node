import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from "typeorm";
import { Habitat } from "./Habitat";
import { Routable } from "../route";

@Entity()
export class TempReading extends Routable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('double precision')
    value: number;

    @ManyToOne(
        _type => Habitat,
        ht => ht.tempReadings,
    )
    @JoinColumn()
    habitat: Habitat;

    @CreateDateColumn()
    dt: Date;

    public static relations (): string[] {
        return ['habitat'];
    }
}
