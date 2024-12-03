var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SocketHandlers {
    constructor(io, roomController, messageController, helper) {
        this.io = io;
        this.roomController = roomController;
        this.messageController = messageController;
        this.helper = helper;
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () { return this.handleConnection(socket); }));
    }
    handleConnection(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('a user connected');
            try {
                const rooms = (yield this.roomController.rooms()) || [];
                socket.emit('all-rooms', rooms);
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                console.log(`Failed to create room: ${errorMessage}`);
                socket.emit('error', `Failed to create room: ${errorMessage}`);
            }
            socket.on('create-room', (roomName) => __awaiter(this, void 0, void 0, function* () { return this.createRoom(roomName); }));
            socket.on('join', (joinData) => __awaiter(this, void 0, void 0, function* () { return this.joinRoom(joinData, socket); }));
            socket.on('sendMessage', (messageData) => __awaiter(this, void 0, void 0, function* () { return this.sendMessage(messageData); }));
            socket.on('disconnect', () => this.disconnect());
        });
    }
    createRoom(roomName) {
        return __awaiter(this, void 0, void 0, function* () {
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
                // socket.emit('error', `Failed to create room: ${errorMessage}`);
            }
        });
    }
    joinRoom(data, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, user } = this.helper.addUser(Object.assign({ socket_id: socket.id }, data));
                if (error)
                    return console.log('join error', error);
                // Ensure user is in the correct room
                socket.join(data.room_id);
                const messages = (yield this.messageController.messages()) || [];
                socket.emit('all-messages', messages);
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                console.log(`Failed to create room: ${errorMessage}`);
                socket.emit('error', `Failed to create room: ${errorMessage}`);
            }
        });
    }
    sendMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // const user = this.helper.getUser(socket.id);
            try {
                const newmessage = yield this.messageController.SaveMessage(data);
                if (newmessage) {
                    this.io.to(data.room_id).emit('message', newmessage); // Emit to the specific room 
                }
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                console.log(`Failed to save message: ${errorMessage}`);
                // socket.emit('error', `Failed to save message: ${errorMessage}`);
            }
        });
    }
    disconnect() { console.log('A user disconnected'); }
}
export default SocketHandlers;
