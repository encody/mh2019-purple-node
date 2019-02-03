import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Connection} from "typeorm";
import { Habitat } from "./Habitat";
import { NextFunction, Application, Request, Response } from "express";
import { Routable } from "../route";

@Entity()
export class HabitatType extends Routable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 255,
        unique: true,
    })
    name: string;

    @OneToMany(
        _type => Habitat,
        ht => ht.habitatType,
    )
    habitats: Habitat[];

    public static relations (): string[] {
        return ['habitats'];
    }

    public static route (app: Application, root: string, connection: Connection): void {
        const habitatRepo = connection.getRepository(Habitat);

        app.get(root + '/:id/habitat', async (req, res, next) => {
            res.send(await habitatRepo.find({
                where: {
                    habitatType: req.params.id,
                },
            }));
        });
    }
}
