import { Document, Model, Schema } from "mongoose";
import { FollowRequestModel as FollowRequestDomainModel} from "../../../../../../domain/models/followRequest";
import { FollowRequestListItem } from "../../../../../../domain/models/followRequestListItem";
import { FollowRequestStatus } from "../../../../../../domain/types/follow-request-status";
import { FollowRequestModel } from "../models/followRequest";

export interface IFollowRequestMethods {
    followRequestDomainModel(): FollowRequestDomainModel,
    followRequestDomainListItem(): FollowRequestListItem
}

export interface IFollowRequestMongooseModel extends Model <
    FollowRequestModel,
    {},
    IFollowRequestMethods
>{}

const FollowRequestModelSchema = new Schema<FollowRequestModel, IFollowRequestMongooseModel>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        index: true,
        required: true
    },
    followRequester:  { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    requestStatus: {
        type: String,
        enum: ['ACCEPTED', 'DECLINED', 'PENDING'],
        default: FollowRequestStatus.PENDING,
        required: true
    }
},{timestamps: true});

FollowRequestModelSchema.index({ user: 1, followRequester: 1}, { unique: true });

FollowRequestModelSchema.method("followRequestDomainModel", function(): FollowRequestDomainModel {
    return {
        _id: this._id.toString(),
        user: this.user.toHexString(),
        followRequester: this.followRequester.toHexString(),
        requestStatus: this.requestStatus
    }
});

FollowRequestModelSchema.method("followRequestDomainListItem", function(): FollowRequestListItem {
    return {
        _id: this._id.toString(),
        followRequester: {
            _id: this.followRequester._id.toHexString(),
            name: this.followRequester.name,
            email: this.followRequester.email
        },
        requestStatus: this.requestStatus
    }
});

export default FollowRequestModelSchema;