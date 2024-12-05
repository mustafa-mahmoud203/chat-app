import { Request, Response, NextFunction } from "express";
import BcryptFunctions from "src/utils/bcrypt.js";
import Token from "../utils/token.js";
declare class AuthController {
    private bcryptFunction;
    private tokenFun;
    constructor(bcryptFunction: BcryptFunctions, tokenFun: Token);
    signUp(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
export default AuthController;
