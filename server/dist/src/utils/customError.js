export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
class CustomError {
    handleError(socket, err) {
        if (err instanceof AppError) {
            console.error(`AppError: ${err.message}`);
            socket.emit('error', {
                statusCode: err.statusCode,
                message: err.message
            });
        }
        else {
            console.error("Unexpected error:", err);
            socket.emit('error', {
                statusCode: 500,
                message: "An unexpected error occurred"
            });
        }
    }
}
export default new CustomError();
