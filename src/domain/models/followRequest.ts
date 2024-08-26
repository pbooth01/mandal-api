import { FollowRequestStatus } from "../types/follow-request-status";

export type FollowRequestModel = {
    _id: string;
    user: string;
    followRequester: string;
    requestStatus: FollowRequestStatus
}