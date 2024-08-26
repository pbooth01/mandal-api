import { Types } from "mongoose";

export type UserModel = {
    _id: Types.ObjectId;
    name: string;
    email: string;
}