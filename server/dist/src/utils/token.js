import jwt from 'jsonwebtoken';
class Token {
    constructor() {
        this.jwtVerify = (token = "") => {
            if (!process.env.TOKEN_SIGNATURE)
                throw new Error("TOKEN_SIGNATURE is not defined in environment variables");
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);
                return decoded;
            }
            catch (error) {
                throw new Error("Invalid or expired token");
            }
        };
    }
    jwtSign(payload) {
        if (!process.env.TOKEN_SIGNATURE)
            throw new Error("TOKEN_SIGNATURE is not defined in environment variables");
        const token = jwt.sign(payload, process.env.TOKEN_SIGNATURE, { expiresIn: "30d" });
        return token;
    }
}
export default Token;
