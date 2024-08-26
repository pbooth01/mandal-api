import { FollowRequestModel } from "../../models/followRequest";
import { FollowRequestListItem } from "../../models/followRequestListItem";
import { FollowRequestStatus } from "../../types/follow-request-status";
import { ITransactionRepository } from "./transaction-repository";

export interface IFollowRequestRepository extends ITransactionRepository {
    createFollowRequest(userId: string, requesterId: string, txSession?: any): Promise<FollowRequestModel>;
    updateStatusOfFollowRequest(requestId: string, status: FollowRequestStatus, txSession?: any): Promise<FollowRequestModel | null>;
    findFollowRequestById(followRequestId: string, txSession?: any): Promise<FollowRequestModel | null>;
    findFollowRequestByUserAndRequester(userId: string, requesterId: string, txSession?: any): Promise<FollowRequestModel | null>;
    findFollowRequestRecordsByUserId(userId: string, txSession?: any): Promise<FollowRequestListItem[]>;
    findFollowRequestRecordsByUserIdAndRequestStatus(userId: string, requestStatus: FollowRequestStatus, txSession?: any): Promise<FollowRequestListItem[]>
}