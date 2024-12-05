import jwt from 'jsonwebtoken'

export interface IPayload {
    userId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

class Token {
    public jwtSign(payload: IPayload): string {
        console.log("aaaaa ", process.env.TOKEN_SIGNTURE);

        if (!process.env.TOKEN_SIGNTURE)
            throw new Error("TOKEN_SIGNTURE is not defined in environment variables");
        const token = jwt.sign(payload, process.env.TOKEN_SIGNTURE, { expiresIn: "30d" });
        return token;
    }

    public jwtVerify = (token: string = ""): string | jwt.JwtPayload => {
        if (!process.env.TOKEN_SIGNTURE)
            throw new Error("TOKEN_SIGNTURE is not defined in environment variables");
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNTURE)
            return decoded;
        } catch (error) {
            throw new Error("Invalid or expired token");
        }  
    };
}

export default Token