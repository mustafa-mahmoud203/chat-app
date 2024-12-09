import { Socket } from "socket.io";

export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        Object.setPrototypeOf(this, new.target.prototype);

        Error.captureStackTrace(this, this.constructor)
    }
}


class CustomError {

    public static handleError(socket: Socket, err: any): void {
        if (err instanceof AppError) {
            console.error(`AppError: ${err.message}`);
            socket.emit('error', {
                statusCode: err.statusCode,
                message: err.message
            });
        } else {
            console.error("Unexpected error:", err);
            socket.emit('error', {
                statusCode: 500,
                message: "An unexpected error occurred"
            });
        }
    }
}

export default CustomError;
