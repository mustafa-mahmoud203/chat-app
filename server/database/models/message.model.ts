import { Schema, model, Document } from "mongoose"

export interface IMessage extends Document {
    text: string;
    user_id: string;
    room_id: Schema.Types.ObjectId
}
const messageSchema = new Schema<IMessage>({
    text: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    room_id: {
        type: Schema.ObjectId,
        ref: "Room",
        required: true
    }
}, { timestamps: true })

export const messageModel = model<IMessage>("Message", messageSchema)
