var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { userModel } from "../../database/models/user.model.js";
import { AppError } from "src/utils/customError.js";
class AuthController {
    constructor(bcryptFunction) {
        this.bcryptFunction = bcryptFunction;
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { password, confirmPassword } = _a, data = __rest(_a, ["password", "confirmPassword"]);
                const checkEmail = yield userModel.findOne({ email: data.email });
                if (checkEmail) {
                    return next(new AppError("email already exists....", 400));
                }
                // if (req.file) data.profileImg = req.file.image;
                data.password = this.bcryptFunction.hashPassword(password);
                const user = yield userModel.create(data);
                return res.status(201).json({ message: "Done", user });
            }
            catch (err) {
                return next(new AppError("Internal server error", 500));
            }
        });
    }
    login() { }
}
export default AuthController;
