import { Server, Socket } from 'socket.io';
import Helper from '../../helper.js';
import RoomController from '../controllers/room.js';
import MessageController from '../controllers/message.js';
import CustomError, { AppError } from '../utils/customError.js';

class SocketHandlers {
    constructor(
        private io: Server,
        private roomController: RoomController,
        private messageController: MessageController,
        private helper: Helper,
    ) {

        this.io.on('connection', async (socket: Socket) => this.handleConnection(socket))
    }

    private async handleConnection(socket: Socket) {
        console.log('a user connected');
        try {
            const rooms = await this.roomController.rooms() || []
            socket.emit('all-rooms', rooms);

        } catch (err) {
            CustomError.handleError(socket, err)
        }

        socket.on('create-room', async (roomName) => this.createRoom(roomName, socket));
        socket.on('join', async (joinData) => this.joinRoom(joinData, socket));
        socket.on('sendMessage', async (messageData) => this.sendMessage(messageData, socket));
        socket.on('disconnect', () => this.disconnect())
    }
    private async createRoom(roomName: string, socket: Socket) {
        try {
            const room = await this.roomController.createRoom(roomName)
            if (room) {
                console.log("Room created:", room);
                this.io.emit('room-created', room);
            }
        } catch (err) {
            CustomError.handleError(socket, err)

        }
    }
    private async joinRoom(data: { name: string, room_id: string, user_id: string }, socket: Socket) {
        try {
            const { error, user } = this.helper.addUser({
                socket_id: socket.id,
                ...data
            });
            if (error) throw new AppError(error.message || 'join error', 500)

            // Ensure user is in the correct room
            socket.join(data.room_id);

            const messages = await this.messageController.messages() || []
            socket.emit('all-messages', messages);

        } catch (err) {
            CustomError.handleError(socket, err)
        }
    }

    private async sendMessage(data: { message: string, room_id: string, user_id: string }, socket: Socket) {
        // const user = this.helper.getUser(socket.id);
        try {
            const newmessage = await this.messageController.SaveMessage(data)
            if (newmessage) {
                this.io.to(data.room_id).emit('message', newmessage); // Emit to the specific room 
            }
        } catch (err) {
            CustomError.handleError(socket, err)

        }
    }

    private disconnect(): void { console.log('A user disconnected'); }
}
export default SocketHandlers
