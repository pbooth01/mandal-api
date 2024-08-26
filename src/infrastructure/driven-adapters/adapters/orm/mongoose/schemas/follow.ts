import { Model, Schema } from "mongoose";
import { FollowModel } from "../models/follow";
import { FollowModel as FollowDomainModel } from "../../../../../../domain/models/follow";

export interface IFollowMethods {
    followDomainModel(): FollowDomainModel,
}

export interface IFollowMongooseModel extends Model <
    FollowModel,
    {},
    IFollowMethods
>{}

const FollowModelSchema = new Schema<FollowModel, IFollowMongooseModel>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        index: true,
        required: true
    },
    follower:  { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
},{timestamps: true});

FollowModelSchema.index({ user: 1, follower: 1}, { unique: true });

FollowModelSchema.method("followDomainModel", function(): FollowDomainModel {
    return {
        _id: this._id.toString(),
        user: this.user.toHexString(),
        follower: this.follower.toHexString()
    }
});

export default FollowModelSchema;