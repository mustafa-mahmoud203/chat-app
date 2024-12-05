import { Schema, model, Document } from "mongoose"

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    profileImg: string;
}
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    phone: String,
    profileImg: String,
}, { timestamps: true })

export const userModel = model<IUser>("Message", userSchema)
