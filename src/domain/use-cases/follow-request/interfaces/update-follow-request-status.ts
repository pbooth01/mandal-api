import { FollowRequestModel } from "../../../models/followRequest";

export interface IUpdateFollowRequestStatusService {
    execute: (sessionUserId: string, requestId: string, requestStatus: FollowRequestStatus) => Promise<FollowRequestModel>
}