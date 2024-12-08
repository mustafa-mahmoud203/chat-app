import { Router } from "express";
import AuthController from "../controllers/auth.js";
import BcryptFunctions from "../utils/bcrypt.js";
import Token from "../utils/token.js";
import AuthValidation from "../validations/auth.js";
class AuthRouters {
    constructor(validation, authController) {
        this.validation = validation;
        this.authController = authController;
        this.router = Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/login", this.validation.login(), this.authController.login.bind(this.authController));
        this.router.post("/signup", this.validation.signup(), this.authController.signUp.bind(this.authController));
    }
}
const authController = new AuthController(new BcryptFunctions(), new Token());
export default new AuthRouters(new AuthValidation(), authController).router;
