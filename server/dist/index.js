import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
class App {
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
        });
        this.setMiddleware();
        this.setSocketIOEvents();
    }
    setMiddleware() {
        this.app.use(cors({
            origin: process.env.FRONTEND_URL, // Allow only this origin (frontend)
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        }));
    }
    setSocketIOEvents() {
        this.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('create-room', (roomName) => {
                console.log(`Room created: ${roomName}`);
                this.io.emit('room-created', roomName);
            });
            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        });
    }
    start() {
        this.server.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`));
    }
}
new App().start();
