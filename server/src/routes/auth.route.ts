import { Router, Request, Response, NextFunction } from "express";
import AuthController from "../controllers/auth.js";
import BcryptFunctions from "../utils/bcrypt.js";
import Token from "../utils/token.js";

class AuthRouters {
    public router: Router;

    constructor(private authController: AuthController) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post("/login", (req: Request, res: Response, next: NextFunction) => {
            this.authController.login(req, res, next);
        });
        this.router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
            this.authController.signUp(req, res, next);
        });
    }
}

export default new AuthRouters(new AuthController(new BcryptFunctions(), new Token())).router;
