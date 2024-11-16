import express, { Express } from 'express'
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import 'dotenv/config'

class App {
    private app: Express;
    private port: number;
    private server: any;
    private io: Server;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '5000', 10);
        this.server = createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: process.env.FRONTEND_URL, // Allow only this origin (frontend)
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
            }
        })

        this.setMiddleware();
        this.setSocketIOEvents();
    }

    private setMiddleware() {
        this.app.use(
            cors({
                origin: process.env.FRONTEND_URL, // Allow only this origin (frontend)
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
            }))
    }

    private setSocketIOEvents() {
        this.io.on('connection', (socket: Socket) => {
            console.log('a user connected');

            socket.on('create-room', (roomName: string) => {
                console.log(`Room created: ${roomName}`);
                this.io.emit('room-created', roomName);

            })

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        })
    }

    public start() {
        this.server.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`))
    }

}

new App().start()