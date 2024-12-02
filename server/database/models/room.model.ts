import { Schema, model, Document } from "mongoose"

export interface IRoom extends Document {
    name: string
}
const roomSchema = new Schema<IRoom>({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const roomModel = model<IRoom>("Room", roomSchema)
