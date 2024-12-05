import { Request, Response, NextFunction } from "express";
import BcryptFunctions from "src/utils/bcrypt.js";
import { IUser, userModel } from "../../database/models/user.model.js"
import { AppError } from "src/utils/customError.js";
class AuthController {

    constructor(private bcryptFunction: BcryptFunctions) { }
    public async signUp(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        try {
            const { password, confirmPassword, ...data } = req.body;

            const checkEmail = await userModel.findOne({ email: data.email });
            if (checkEmail) {
                return next(new AppError("email already exists....", 400));
            }
            // if (req.file) data.profileImg = req.file.image;

            data.password = this.bcryptFunction.hashPassword(password)
            const user = await userModel.create(data)


            return res.status(201).json({ message: "Done", user })

        } catch (err) {
            return next(new AppError("Internal server error", 500));
        }

    }
    public login() { }
}

export default AuthController;
