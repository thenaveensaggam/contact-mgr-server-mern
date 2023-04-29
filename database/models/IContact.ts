import mongoose from "mongoose";

export interface IContact {
    name: string;
    user: mongoose.Types.ObjectId;
    imageUrl: string;
    mobile: string;
    email: string;
    company: string;
    title: string;
    groupId: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
