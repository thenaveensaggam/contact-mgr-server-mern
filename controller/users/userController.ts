import {Request, Response} from "express";
import UserTable from "../../database/schemas/userSchema";
import bcryptjs from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import {IUser} from "../../database/models/IUser";
import mongoose from "mongoose";
import {getAuthUserInfoFromRequestHeader} from "../../util/UserUtil";

export interface UserTokenPayload {
    id: string | undefined;
    email: string;
}


/**
 @usage : Register User
 @method : POST
 @body : username , email , password
 @access : PUBLIC
 @url : http://localhost:9999/users/register
 */
export const registerUser = async (request: Request, response: Response) => {
    try {
        // read the form data
        const {username, email, password} = request.body;

        // check if the email is exists or not
        const user = await UserTable.findOne({email: email});
        if (user) {
            return response.status(401).json({msg: "User is already exists!"})
        }

        // encrypt the password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // gravatar image url
        let imageUrl: string = gravatar.url(email, {
            size: '200',
            rating: 'pg',
            default: 'mm'
        });

        // create user object
        const newUser: IUser = {
            username: username,
            email: email,
            password: hashPassword,
            imageUrl: imageUrl,
            isAdmin: false,
            isSuperAdmin: false
        };

        // save to DB
        const createdUser = await new UserTable(newUser).save(); // INSERT
        if (createdUser) {
            return response.status(200).json({
                msg: "Registration is Success",
                user: createdUser
            });
        }
    } catch (error: any) {
        return response.status(500).json({errors: [error.message]});
    }
};

/**
 @usage : Login User
 @method : POST
 @body : email , password
 @access : PUBLIC
 @url : http://localhost:9999/users/login
 */
export const loginUser = async (request: Request, response: Response) => {
    try {
        // read the form data
        const {email, password} = request.body;

        // check if the email is exists?
        const user: IUser | undefined | null = await UserTable.findOne({email: email});
        if (!user) {
            return response.status(401).json({msg: "Invalid Credentials Email"});
        }

        // check the password
        const isMatch: boolean = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return response.status(401).json({msg: "Invalid Credentials Password!"})
        }

        const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        const payload: { user: UserTokenPayload } = {
            user: {
                id: user._id,
                email: user.email
            }
        };
        // Create token
        if (secretKey) {
            jwt.sign(payload, secretKey, {
                algorithm: "HS256",
                expiresIn: 100000000000000
            }, (error, encoded) => {
                if (error) {
                    return response.status(401).json({msg: "Unable to generate the Token"});
                }
                if (encoded) { // token
                    return response.status(200).json({
                        msg: "Login is Success",
                        token: encoded,
                        user: user
                    })
                }
            })
        }
    } catch (error: any) {
        return response.status(500).json({errors: [error.message]});
    }
};

/**
 @usage : Get User Info
 @method : GET
 @body : no-body
 @access : PRIVATE
 @url : http://localhost:9999/users/me
 */
export const getUserInfo = async (request: Request, response: Response) => {
    try {
        const user = await getAuthUserInfoFromRequestHeader(request, response);
        if (user) {
            return response.status(200).json({user: user});
        }
    } catch (error: any) {
        return response.status(500).json({errors: [error.message]});
    }
};
