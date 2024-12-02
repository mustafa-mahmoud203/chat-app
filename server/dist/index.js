var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
import Helper from './helper.js';
import DataBaseConnection from "./database/connection.js";
import RoomController from './src/controllers/room.js';
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
            },
        });
        this.helper = new Helper();
        this.dbconnection = new DataBaseConnection();
        this.roomController = new RoomController();
        this.setMiddleware();
        this.setSocketIOEvents();
        this.setDataBaseConnection();
    }
    setDataBaseConnection() {
        this.dbconnection.connectionDB();
    }
    setMiddleware() {
        this.app.use(cors({
            origin: process.env.FRONTEND_URL, // Allow only this origin (frontend)
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        }));
    }
    setSocketIOEvents() {
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log('a user connected');
            try {
                const rooms = yield this.roomController.rooms();
                if (rooms) {
                    socket.emit('all-rooms', rooms);
                }
                else {
                    socket.emit('all-rooms', []);
                }
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                console.log(`Failed to create room: ${errorMessage}`);
                socket.emit('error', `Failed to create room: ${errorMessage}`);
            }
            socket.on('create-room', (roomName) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const room = yield this.roomController.createRoom(roomName);
                    if (room) {
                        console.log("Room created:", room);
                        this.io.emit('room-created', room);
                    }
                }
                catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                    console.log(`Failed to create room: ${errorMessage}`);
                    socket.emit('error', `Failed to create room: ${errorMessage}`);
                }
            }));
            socket.on('join', ({ name, room_id, user_id }) => {
                const data = { socket_id: socket.id, name, user_id, room_id };
                const { error, user } = this.helper.addUser(data);
                if (error) {
                    console.log('join error', error);
                }
                else {
                    console.log('join user', user);
                    socket.join(room_id); // Ensure user is in the correct room
                }
            });
            socket.on('sendMessage', ({ message, room_id, user_id }) => {
                console.log('messageData  ', { message, room_id, user_id });
                const user = this.helper.getUser(socket.id);
                console.log(user);
                const msgToStore = {
                    room_id,
                    text: message,
                };
                this.io.to(room_id).emit('message', msgToStore); // Emit to the specific room
            });
            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        }));
    }
    start() {
        this.server.listen(this.port, () => console.log(`Server listening on port ${this.port}!`));
    }
}
new App().start();
