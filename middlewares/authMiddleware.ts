import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {UserTokenPayload} from "../controller/users/userController";

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // read the token from request header
        const token = request.headers['x-auth-token'];
        if (!token) {
            return response.status(401).json({
                msg: "NO Token Provided!"
            });
        }

        const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        if (secretKey && token && typeof token === "string") {
            const decode: { user: UserTokenPayload } | any = jwt.verify(token, secretKey, {algorithms: ["HS256"]}); // scanning the token
            if (!decode) {
                return response.status(401).json({msg: "Invalid Token Provided"});
            }
            const {user} = decode;
            request.headers['user-info'] = user;
            next(); // must
        }
    } catch (error) {
        return response.status(500).json({msg: "Token verification is failed!"})
    }
};