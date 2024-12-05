"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class CustomError {
    static handleError(socket, err) {
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
exports.default = CustomError;
//# sourceMappingURL=customError.js.map