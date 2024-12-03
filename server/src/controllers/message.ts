import { messageModel, IMessage } from "../../database/models/message.model.js"
class MessageController {
    public async SaveMessage(data: any): Promise<IMessage | null> {
        try {
            const room = await messageModel.create(data)
            return room
        } catch (err) {
            console.log(`Failed to save message: ${err}`);
            throw new Error(`Failed to save message: ${err}`)
        }
    }

    public async messages(): Promise<IMessage[]> {
        try {
            const messages = await messageModel.find({})
            return messages
        } catch (err) {
            console.log(`Failed to retrieve messages: ${err}`);
            throw new Error(`Failed to retrieve messages: ${err}`)
        }
    }
}

export default MessageController