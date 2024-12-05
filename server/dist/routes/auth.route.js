"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_js_1 = __importDefault(require("../controllers/auth.js"));
const bcrypt_js_1 = __importDefault(require("../utils/bcrypt.js"));
const token_js_1 = __importDefault(require("../utils/token.js"));
const auth_js_2 = __importDefault(require("../validations/auth.js"));
class AuthRouters {
    constructor(validation, authController) {
        this.validation = validation;
        this.authController = authController;
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/login", this.validation.login.bind(this.validation), (req, res, next) => {
            this.authController.login(req, res, next);
        });
        this.router.post("/signup", (req, res, next) => {
            this.authController.signUp(req, res, next);
        });
    }
}
exports.default = new AuthRouters(new auth_js_2.default(), new auth_js_1.default(new bcrypt_js_1.default(), new token_js_1.default())).router;
//# sourceMappingURL=auth.route.js.map