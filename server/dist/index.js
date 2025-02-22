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
import MessageController from './src/controllers/message.js';
import SocketHandlers from './src/sockets/handlers.js';
import { AppError } from './src/utils/customError.js';
import authRote from "./src/routes/auth.route.js";
import ErrorHandling from './src/middlewares/globalErrorHandling.js';
class App {
    constructor(helper, dbconnection, roomController, messageController, errorHandling) {
        this.helper = helper;
        this.dbconnection = dbconnection;
        this.roomController = roomController;
        this.messageController = messageController;
        this.errorHandling = errorHandling;
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
        this.initRoutes();
        this.setSocketIOEvents();
        this.setErrorHandling();
    }
    setMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({
            origin: process.env.FRONTEND_URL, // Allow only this origin (frontend)
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        }));
    }
    setSocketIOEvents() {
        new SocketHandlers(this.io, this.roomController, this.messageController, this.helper);
    }
    initRoutes() {
        this.app.use("/auth", authRote);
    }
    setErrorHandling() {
        this.app.use("*", (req, res, next) => {
            return next(new AppError("404 Page Not Found", 404));
        });
        this.app.use(this.errorHandling.globalErrorHandling);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbconnection.connectionDB();
                this.server.listen(this.port, () => console.log(`Server listening on port ${this.port}!`));
            }
            catch (err) {
                console.error('Failed to start server:', err);
            }
        });
    }
}
new App(new Helper(), new DataBaseConnection(), new RoomController(), new MessageController(), new ErrorHandling()).start();
