import { FollowRequestModel } from "../../../models/followRequest";
import { FollowRequestListItem } from "../../../models/followRequestListItem";
import { FollowRequestStatus } from "../../../types/follow-request-status";

export interface IGetFollowRequestsService {
    execute: (sessionUserId: string, requestStatus: FollowRequestStatus) => Promise<FollowRequestListItem[]>
}