import { check, ValidationChain } from 'express-validator';
import validationMiddleware from '../middlewares/validation.js';
import { RequestHandler } from 'express';

class AuthValidation {
    public login() {
        return [
            check("email").notEmpty().withMessage('email is required').isEmail().withMessage('Invalid email format'),
            check("password").notEmpty()
                .withMessage('Password required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),

            validationMiddleware
        ];
    }
}

export default AuthValidation