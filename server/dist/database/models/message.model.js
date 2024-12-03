import { Schema, model } from "mongoose";
const messageSchema = new Schema({
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
}, { timestamps: true });
export const messageModel = model("Message", messageSchema);
