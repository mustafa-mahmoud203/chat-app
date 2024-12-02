import { Schema, model } from "mongoose";
const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });
export const roomModel = model("Room", roomSchema);
