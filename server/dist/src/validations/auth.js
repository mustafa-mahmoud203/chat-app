import { check } from 'express-validator';
import validationMiddleware from '../middlewares/validation.js';
import { AppError } from '../utils/customError.js';
class AuthValidation {
    login() {
        return [
            check("email").notEmpty().withMessage('email is required').isEmail().withMessage('Invalid email format'),
            check("password").notEmpty()
                .withMessage('Password required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),
            validationMiddleware
        ];
    }
    signup() {
        return [
            check("name").notEmpty().withMessage('name is required').isLength({ min: 7 }).withMessage('name must be at least 7 characters').isLength({ max: 32 })
                .withMessage("name must be at most 32 characters"),
            check("email").notEmpty().withMessage('email is required').isEmail().withMessage('Invalid email format'),
            check("password").notEmpty()
                .withMessage('Password required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters').custom((password, { req: request }) => {
                if (password !== request.body.confirmPassword)
                    throw new AppError("Password Confirmation incorrect", 400);
                return true;
            }),
            check("confirmPassword")
                .notEmpty()
                .withMessage("Password confirmation is required"),
            check("phone")
                .optional(),
            check("role")
                .optional()
                .isIn(["user", "admin"])
                .withMessage("Role must be either 'user' or 'admin'"),
            check("profileImg").optional(),
            validationMiddleware
        ];
    }
}
export default AuthValidation;
