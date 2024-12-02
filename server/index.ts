import express, { Express } from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
import Helper from './helper.js';
import DataBaseConnection from "./database/connection.js"
import RoomController from './src/controllers/room.js';
class App {
    private app: Express;
    private port: number;
    private server: any;
    private io: Server;
    private helper: Helper;
    private dbconnection: DataBaseConnection
    private roomController: RoomController

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
        this.dbconnection = new DataBaseConnection()
        this.roomController = new RoomController()
        this.setMiddleware();
        this.setSocketIOEvents();
        this.setDataBaseConnection();
    }

    private setDataBaseConnection(): void {
        this.dbconnection.connectionDB()
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
        this.io.on('connection', async (socket: Socket) => {
            console.log('a user connected');
            try {
                const rooms = await this.roomController.rooms()
                if (rooms) {
                    socket.emit('all-rooms', rooms);
                }
                else {
                    socket.emit('all-rooms', []);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                console.log(`Failed to create room: ${errorMessage}`);
                socket.emit('error', `Failed to create room: ${errorMessage}`);
            }

            socket.on('create-room', async (roomName: string) => {
                try {
                    const room = await this.roomController.createRoom(roomName)
                    if (room) {
                        console.log("Room created:", room);
                        this.io.emit('room-created', room);
                    }
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                    console.log(`Failed to create room: ${errorMessage}`);
                    socket.emit('error', `Failed to create room: ${errorMessage}`);
                }

            });

            socket.on('join', ({ name, room_id, user_id }: { name: string, room_id: string, user_id: number }) => {
                const data = { socket_id: socket.id, name, user_id, room_id };
                const { error, user } = this.helper.addUser(data);
                if (error) {
                    console.log('join error', error);
                } else {
                    console.log('join user', user);
                    socket.join(room_id); // Ensure user is in the correct room
                }
            });

            socket.on('sendMessage', ({ message, room_id, user_id }: { message: string, room_id: string, user_id: number }) => {
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
        });
    }

    public start() {
        this.server.listen(this.port, () => console.log(`Server listening on port ${this.port}!`));
    }
}

new App().start();
