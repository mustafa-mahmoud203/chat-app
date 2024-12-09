import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';

import Helper from './helper.js';
import DataBaseConnection from "./database/connection.js"
import RoomController from './src/controllers/room.js';
import MessageController from './src/controllers/message.js';
import SocketHandlers from './src/sockets/handlers.js';
import { AppError } from './src/utils/customError.js';

import ErrorMiddleware from "./src/middlewares/globalErrorHandling.js"
import authRote from "./src/routes/auth.route.js"
import ErrorHandling from './src/middlewares/globalErrorHandling.js';
class App {
    private app: Express;
    private port: number;
    private server: any;
    private io: Server;
    constructor(
        private helper: Helper,
        private dbconnection: DataBaseConnection,
        private roomController: RoomController,
        private messageController: MessageController,
        private errorHandling: ErrorHandling
    ) {
        this.app = express();
        this.port = parseInt(process.env.PORT || '5000', 10);
        this.server = createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: process.env.FRONTEND_URL, // Allow only this origin (frontend)
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
            },
        });

        this.setMiddleware();
        this.initRoutes()
        this.setSocketIOEvents();
        this.setErrorHandling()
    }

    private setMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(
            cors({
                origin: process.env.FRONTEND_URL, // Allow only this origin (frontend)
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
            })
        );
    }

    private setSocketIOEvents(): void {
        new SocketHandlers(this.io, this.roomController, this.messageController, this.helper)
    }

    private initRoutes(): void {
        this.app.use("/auth", authRote);

    }

    private setErrorHandling(): void {

        this.app.use("*", (req: Request, res: Response, next: NextFunction) => {
            return next(new AppError("404 Page Not Found", 404));
        });


        this.app.use(this.errorHandling.globalErrorHandling);

    }
    public async start(): Promise<void> {
        try {
            await this.dbconnection.connectionDB();
            this.server.listen(this.port, () =>
                console.log(`Server listening on port ${this.port}!`)
            );
        } catch (err) {
            console.error('Failed to start server:', err);
        }
    }
}

new App(
    new Helper(),
    new DataBaseConnection(),
    new RoomController(),
    new MessageController(),
    new ErrorHandling()
).start();
