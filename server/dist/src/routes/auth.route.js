import { Router } from "express";
import AuthController from "../controllers/auth.js";
import BcryptFunctions from "../utils/bcrypt.js";
import Token from "../utils/token.js";
class AuthRouters {
    constructor(authController) {
        this.authController = authController;
        this.router = Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/login", (req, res, next) => {
            this.authController.login(req, res, next);
        });
        this.router.post("/signup", (req, res, next) => {
            this.authController.signUp(req, res, next);
        });
    }
}
export default new AuthRouters(new AuthController(new BcryptFunctions(), new Token())).router;
