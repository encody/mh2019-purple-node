import { Repository, Connection, Raw, } from "typeorm";
import { Application, Request, Response, NextFunction } from "express";

export class Routable {
    public static relations (): string[] { return []; }
    public static route<T> (app: Application, root: string, connection: Connection) { }
}

export function routeDefault (app: Application, root: string, repo: Repository<any>, relations: string[]): void {
    app.get(root, async (req: Request, res: Response, next: NextFunction) => {
        res.send(await repo.find({
            relations,
        }));
    });

    app.get(root + '/:id', async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const find = await repo.findOne({
            where: { id },
            relations,
        });
        res.send(await find);
    });

    app.post(root, async (req: Request, res: Response, next: NextFunction) => {
        const create = repo.create();
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                create[key] = req.body[key];
            }
        }
        res.send(await repo.save(<any> create));
    });

    app.post(root + '/:id', async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const find = await repo.findOne({
            where: { id },
            relations,
        });

        for (let key in req.body) {
            if (req.body.hasOwnProperty(key) && find.hasOwnProperty(key)) {
                find[key] = req.body[key];
            }
        }

        res.send(await repo.save(<any> find));
    });

    app.delete(root + '/:id', async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const find = await repo.findOne(id);
        res.send(await repo.remove(<any> find));
    });
}
