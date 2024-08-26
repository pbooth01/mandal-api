import { Types } from "mongoose";
import { FollowRequestStatus } from "../../../../../../domain/types/follow-request-status";

export interface FollowRequestModel {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    followRequester: Types.ObjectId;
    requestStatus: FollowRequestStatus
}