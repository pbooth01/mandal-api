import { FollowRequestStatus } from "../types/follow-request-status";
import { UserModel } from "./user";

export type FollowRequestListItem = {
    _id: string;
    followRequester: UserModel;
    requestStatus: FollowRequestStatus;
}