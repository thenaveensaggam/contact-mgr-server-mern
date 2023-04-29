import {Request, Response} from "express";
import mongoose from "mongoose";
import UserTable from "../database/schemas/userSchema";
import {IUser} from "../database/models/IUser";

export const getAuthUserInfoFromRequestHeader = async (request: Request, response: Response): Promise<IUser | boolean | any> => {
    try {
        return new Promise(async (resolve, reject) => {
            const userInfo: any = request.headers['user-info'];
            if (userInfo && userInfo.id) {
                const mongoUserId = new mongoose.Types.ObjectId(userInfo.id);
                const user = await UserTable.findById(mongoUserId);
                if (!user) {
                    reject(false);
                    return response.status(404).json({
                        msg: "No User Found!"
                    })
                }
                resolve(user);
            }
        })
    } catch (error) {
        return response.status(500).json({
            msg: "Unable to get User Info!"
        })
    }
};