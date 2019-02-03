import * as bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as crypto from 'crypto';
import * as express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Habitat } from "./entity/Habitat";
import { HabitatType } from "./entity/HabitatType";
import { MassReading } from "./entity/MassReading";
import { TempReading } from "./entity/TempReading";
import { User } from "./entity/User";
import { hashPasswordAndSalt } from "./hash";
import { routeDefault } from "./route";

const sessionCookie = 'fishina-session';

createConnection().then(async connection => {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors({
        origin: true,
        credentials: true,
    }));
    app.use(cookieParser());

    const sessions: Map<string, {
        userId: number,
        userName: string,
        token: string,
        expires: number,
    }> = new Map();

    const userRepo = connection.getRepository(User);
    const habitatRepo = connection.getRepository(Habitat);

    // app.get('/test', async (req, res, next) => {
    //     res.send(await habitatRepo.find({
    //         relations: [ 'habitatType' ],
    //     }));
    // });

    app.post('/session', async (req, res, next) => {
        const session = sessions.get(req.cookies[sessionCookie]);

        res.send(session || false);
    });

    app.post('/login', async (req: express.Request, res: express.Response) => {
        const user = await userRepo.findOne({
            userName: req.body.userName,
        });

        if (user) {
            const hashed = hashPasswordAndSalt(
                req.body.pass,
                user.salt,
            );

            if (Buffer.compare(user.pass, hashed) === 0) {
                const token = crypto.randomBytes(32).toString('hex');
                sessions.set(token, {
                    userId: user.id,
                    // Expire session in 3 hours
                    expires: Date.now() + 1000 * 60 * 60 * 3,
                    token,
                    userName: user.userName,
                });
                res.cookie(sessionCookie, token).send(true);
                return;
            }
        }

        res.status(401);
        res.clearCookie(sessionCookie).send(false);
        res.end();
    });

    app.all('/logout', async (req: express.Request, res: express.Response) => {
        res.clearCookie(sessionCookie).send(true);
    });

    // Verify login session
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.cookies[sessionCookie] && sessions.get(req.cookies[sessionCookie]).expires > Date.now()) {
            next();
        } else {
            res.status(401);
            res.send(false);
            res.end();
        }
    });

    const entities: {schema: any, path: string}[] = [
        // { schema: User,          path: '/user',          },
        { schema: Habitat,       path: '/habitat',       },
        { schema: HabitatType,   path: '/habitatType',   },
        { schema: MassReading,   path: '/massReading',   },
        { schema: TempReading,   path: '/tempReading',   },
    ];

    entities.forEach(entity => {
        const repo = connection.getRepository(entity.schema);
        routeDefault(app, entity.path, repo, entity.schema.relations());
        entity.schema.route(app, entity.path, connection);
    });

    app.use((req, res, next) => {
        const sess = sessions.get(req.cookies[sessionCookie]);
        if (sess.userName === 'admin' || req.params.id === sess.userId) {
            next();
        } else {
            res.status(401);
            res.send(false);
            res.end();
        }
    });

    routeDefault(app, '/user', connection.getRepository(User), User.relations());

    app.listen(process.env.PORT || 80);

    console.log("Server started");
}).catch(error => console.log(error));
