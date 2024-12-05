"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() {
        this.jwtVerify = (token = "") => {
            if (!process.env.TOKEN_SIGNTURE)
                throw new Error("TOKEN_SIGNTURE is not defined in environment variables");
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SIGNTURE);
                return decoded;
            }
            catch (error) {
                throw new Error("Invalid or expired token");
            }
        };
    }
    jwtSign(payload) {
        console.log("aaaaa ", process.env.TOKEN_SIGNTURE);
        if (!process.env.TOKEN_SIGNTURE)
            throw new Error("TOKEN_SIGNTURE is not defined in environment variables");
        const token = jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SIGNTURE, { expiresIn: "30d" });
        return token;
    }
}
exports.default = Token;
//# sourceMappingURL=token.js.map