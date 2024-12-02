import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
import Helper from '';
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
        this.helper = new Helper();
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
            console.log(socket.id);
            // socket.on('join', ({ name, room_id, user_id }: { name: string, room_id: number, user_id: number }) => {
            //     const data = { socket_id: socket.id, name, user_id, room_id }
            //     const { error, user } = this.helper.addUser(data)
            // })
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
