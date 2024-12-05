import { Request, Response, NextFunction } from "express";
import BcryptFunctions from "src/utils/bcrypt.js";
import { IUser, userModel } from "../../database/models/user.model.js"
import { AppError } from "../utils/customError.js";
import Token, { IPayload } from "../utils/token.js";
class AuthController {

    constructor(
        private bcryptFunction: BcryptFunctions,
        private tokenFun: Token
    ) { }
    public async signUp(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        try {
            const { password, confirmPassword, ...data } = req.body;

            const checkEmail: IUser | null = await userModel.findOne({ email: data.email });
            if (checkEmail) {
                return next(new AppError("email already exists....", 400));
            }
            // if (req.file) data.profileImg = req.file.image;

            data.password = this.bcryptFunction.hashPassword(password)
            const user: IUser | null = await userModel.create(data)


            return res.status(201).json({ message: "Done", user })

        } catch (err: any) {
            return next(new AppError(err.message, 500));
        }

    }
    public async login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        try {
            const { email, password } = req.body
            const user: IUser | null = await userModel.findOne({ email })
            if (!user) return next(new AppError("Invalid email or password", 400));

            const checkpassword: boolean = await this.bcryptFunction.comparePassword(password, user.password)

            if (!checkpassword) return next(new AppError("invalid email or password", 400));

            const payload: IPayload = {
                userId: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
            const token: string = this.tokenFun.jwtSign(payload)
            return res.status(200).json({ message: "Done", token });

        } catch (err: any) {
            return next(new AppError(err.message, 500));
        }
    }
}

export default AuthController;
