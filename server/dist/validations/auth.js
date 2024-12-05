"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validation_js_1 = __importDefault(require("../middlewares/validation.js"));
class AuthValidation {
    login(req, res, next) {
        return [
            (0, express_validator_1.check)("email").notEmpty().withMessage('email is required').isEmail().withMessage('Invalid email format'),
            (0, express_validator_1.check)("password").notEmpty()
                .withMessage('Password required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),
            validation_js_1.default
        ];
    }
}
exports.default = AuthValidation;
//# sourceMappingURL=auth.js.map