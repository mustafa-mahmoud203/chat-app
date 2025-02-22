import jwt from 'jsonwebtoken';
class Token {
    constructor() {
        this.jwtVerify = (token = "") => {
            if (!process.env.TOKEN_SIGNTURE)
                throw new Error("TOKEN_SIGNTURE is not defined in environment variables");
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SIGNTURE);
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
        const token = jwt.sign(payload, process.env.TOKEN_SIGNTURE, { expiresIn: "30d" });
        return token;
    }
}
export default Token;
