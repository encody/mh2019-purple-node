import { NextFunction, Request, Response } from "express";
import { getRepository, Repository } from "typeorm";

export interface ControllerRouteConfig {
    method: 'get' | 'post' | 'delete' | 'put',
    path: string,
    call: string,
}

export class DefaultRepositoryEndpointController {
    private repository: Repository<any>;
    private path: string;

    public constructor (c: any, path: string) {
        this.repository = getRepository(c);
        this.path = path;
    }

    routes (): ControllerRouteConfig[] {
        return [
            {
                method: 'get',
                path: this.path,
                call: 'all',
            },
            {
                method: 'get',
                path: this.path + "/:id",
                call: 'one',
            },
            {
                method: 'post',
                path: this.path,
                call: 'create',
            },
            {
                method: 'post',
                path: this.path + '/:id',
                call: 'update',
            },
            {
                method: 'delete',
                path: this.path + "/:id",
                call: 'remove',
            },
        ];
    }

    async all(request: Request, response: Response, next: NextFunction) {
        return this.repository.find().catch(() => false);
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id).catch(() => false);
    }

    async create (request: Request, response: Response, next: NextFunction) {
        return this.repository.save(request.body).catch(() => false);
    }

    async update (request: Request, response: Response, next: NextFunction) {
        const o = await this.repository.findOne({ id: request.params.id });
        for (let key in request.body) {
            if (request.body.hasOwnProperty(key)) {
                o[key] = request.body[key];
            }
        }
        return this.repository.save(o).catch(() => false);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let objectToRemove = await this.repository.findOne(request.params.id);
        await this.repository.remove(objectToRemove).catch(() => false);
    }
}
