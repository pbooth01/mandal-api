import { FollowRequestModel } from "../../../models/followRequest";

export interface ICreateFollowRequestService {
    execute: (sessionUserId: string, userId: string) => Promise<FollowRequestModel>;
}