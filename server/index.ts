import express, { Express } from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
import Helper from './helper.js';
import DataBaseConnection from "./database/connection.js"
import RoomController from './src/controllers/room.js';
import MessageController from './src/controllers/message.js';
import SocketHandlers from './src/sockets/handlers.js';
class App {
    private app: Express;
    private port: number;
    private server: any;
    private io: Server;
    constructor(
        private helper: Helper,
        private dbconnection: DataBaseConnection,
        private roomController: RoomController,
        private messageController: MessageController) {
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
        this.setSocketIOEvents();
    }

    private setMiddleware(): void {
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
    new MessageController()
).start();
