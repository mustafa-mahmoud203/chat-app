import bcrypt from 'bcrypt'
import { AppError } from './customError.js';
class BcryptFunctions {
    public async hashPassword(password: string) {

        const saltRounds = parseInt(process.env.SALTROUNDS as string);
        if (isNaN(saltRounds) || saltRounds <= 0)
            throw new AppError('Invalid SALTROUNDS value in environment variables', 500);

        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashed = await bcrypt.hash(password, salt);
            return hashed;
        } catch (error) {
            throw new AppError('Error while hashing password', 500);
        }
    }
    public async comparePassword(plainPassword: string, hashedPassword: string) {
        if (!plainPassword || !hashedPassword) {
            throw new AppError('Both passwords must be provided', 400);
        }

        try {
            const match = await bcrypt.compare(plainPassword, hashedPassword);
            return match;
        } catch (error) {
            throw new AppError('Error while comparing passwords', 500);
        }
    }
}

export default BcryptFunctions