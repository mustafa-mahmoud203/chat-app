var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import { AppError } from './customError.js';
class BcryptFunctions {
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = parseInt(process.env.SALTROUNDS);
            if (isNaN(saltRounds) || saltRounds <= 0)
                throw new AppError('Invalid SALTROUNDS value in environment variables', 500);
            try {
                const salt = yield bcrypt.genSalt(saltRounds);
                const hashed = yield bcrypt.hash(password, salt);
                return hashed;
            }
            catch (error) {
                throw new AppError('Error while hashing password', 500);
            }
        });
    }
    comparePassword(plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!plainPassword || !hashedPassword) {
                throw new AppError('Both passwords must be provided', 400);
            }
            try {
                const match = yield bcrypt.compare(plainPassword, hashedPassword);
                return match;
            }
            catch (error) {
                throw new AppError('Error while comparing passwords', 500);
            }
        });
    }
}
export default BcryptFunctions;
