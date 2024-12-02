import { error } from "console";
import { roomModel, IRoom } from "../../database/models/room.model.js"
class RoomController {
    public async createRoom(name: string): Promise<IRoom | null> {
        try {
            const room = await roomModel.create({ name })
            return room
        } catch (err) {
            console.log(`Failed to create room: ${err}`);
            throw new Error(`Failed to create room: ${err}`)
        }
    }

    public async rooms(): Promise<IRoom[]> {
        try {
            const rooms = await roomModel.find({})
            return rooms
        } catch (err) {
            console.log(`Failed to retrieve rooms: ${err}`);
            throw new Error(`Failed to retrieve rooms: ${err}`)
        }
    }
}

export default RoomController