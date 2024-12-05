"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const customError_js_1 = require("./customError.js");
class BcryptFunctions {
    async hashPassword(password) {
        const saltRounds = parseInt(process.env.SALTROUNDS);
        if (isNaN(saltRounds) || saltRounds <= 0)
            throw new customError_js_1.AppError('Invalid SALTROUNDS value in environment variables', 500);
        try {
            const salt = await bcrypt_1.default.genSalt(saltRounds);
            const hashed = await bcrypt_1.default.hash(password, salt);
            return hashed;
        }
        catch (error) {
            throw new customError_js_1.AppError('Error while hashing password', 500);
        }
    }
    async comparePassword(plainPassword, hashedPassword) {
        if (!plainPassword || !hashedPassword) {
            throw new customError_js_1.AppError('Both passwords must be provided', 400);
        }
        try {
            const match = await bcrypt_1.default.compare(plainPassword, hashedPassword);
            return match;
        }
        catch (error) {
            throw new customError_js_1.AppError('Error while comparing passwords', 500);
        }
    }
}
exports.default = BcryptFunctions;
//# sourceMappingURL=bcrypt.js.map