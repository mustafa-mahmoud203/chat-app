"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_js_1 = __importStar(require("../utils/customError.js"));
class SocketHandlers {
    constructor(io, roomController, messageController, helper) {
        this.io = io;
        this.roomController = roomController;
        this.messageController = messageController;
        this.helper = helper;
        this.io.on('connection', async (socket) => this.handleConnection(socket));
    }
    async handleConnection(socket) {
        console.log('a user connected');
        try {
            const rooms = await this.roomController.rooms() || [];
            socket.emit('all-rooms', rooms);
        }
        catch (err) {
            customError_js_1.default.handleError(socket, err);
        }
        socket.on('create-room', async (roomName) => this.createRoom(roomName, socket));
        socket.on('join', async (joinData) => this.joinRoom(joinData, socket));
        socket.on('sendMessage', async (messageData) => this.sendMessage(messageData, socket));
        socket.on('disconnect', () => this.disconnect());
    }
    async createRoom(roomName, socket) {
        try {
            const room = await this.roomController.createRoom(roomName);
            if (room) {
                console.log("Room created:", room);
                this.io.emit('room-created', room);
            }
        }
        catch (err) {
            customError_js_1.default.handleError(socket, err);
        }
    }
    async joinRoom(data, socket) {
        try {
            const { error, user } = this.helper.addUser({
                socket_id: socket.id,
                ...data
            });
            if (error)
                throw new customError_js_1.AppError(error.message || 'join error', 500);
            socket.join(data.room_id);
            const messages = await this.messageController.messages() || [];
            socket.emit('all-messages', messages);
        }
        catch (err) {
            customError_js_1.default.handleError(socket, err);
        }
    }
    async sendMessage(data, socket) {
        try {
            const newmessage = await this.messageController.SaveMessage(data);
            if (newmessage) {
                this.io.to(data.room_id).emit('message', newmessage);
            }
        }
        catch (err) {
            customError_js_1.default.handleError(socket, err);
        }
    }
    disconnect() { console.log('A user disconnected'); }
}
exports.default = SocketHandlers;
//# sourceMappingURL=handlers.js.map