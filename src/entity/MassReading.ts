import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Routable } from "../route";
import { Habitat } from "./Habitat";

@Entity()
export class MassReading extends Routable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('double precision')
    value: number;

    @ManyToOne(
        _type => Habitat,
        ht => ht.massReadings,
    )
    @JoinColumn()
    habitat: Habitat;

    @CreateDateColumn()
    dt: Date;

    public static relations (): string[] {
        return ['habitat'];
    }
}
