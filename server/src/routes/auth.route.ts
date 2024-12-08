import { Router, Request, Response, NextFunction } from "express";
import AuthController from "../controllers/auth.js";
import BcryptFunctions from "../utils/bcrypt.js";
import Token from "../utils/token.js";
import AuthValidation from "../validations/auth.js";
import validationMiddleware from "../middlewares/validation.js";

class AuthRouters {
    public router: Router;

    constructor(private validation: AuthValidation, private authController: AuthController) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {

        this.router.post("/login", this.validation.login(), this.authController.login.bind(this.authController)
        );
        this.router.post("/signup", this.validation.signup(), this.authController.signUp.bind(this.authController)
        );
    }
}

const authController = new AuthController(new BcryptFunctions(), new Token())
export default new AuthRouters(new AuthValidation(), authController).router;
