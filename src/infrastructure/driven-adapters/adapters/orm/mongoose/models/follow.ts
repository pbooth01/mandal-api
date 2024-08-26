import { Types } from "mongoose";

export interface FollowModel {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    follower: Types.ObjectId;
}