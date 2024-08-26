import { FollowRequestModel } from "../../../../domain/models/followRequest";
import { FollowRequestListItem } from "../../../../domain/models/followRequestListItem";
import { FollowRequestStatus } from "../../../../domain/types/follow-request-status";
import { ITransactionDataSource } from "./transaction-data-source";


export interface IFollowRequestDataSource extends ITransactionDataSource {
    createFollowRequest(userId: string, followerId: string, txSession: any): Promise<FollowRequestModel>;
    updateStatusOfFollowRequest(requestId: string, status: string, txSession: any): Promise<FollowRequestModel | null>;
    findFollowRequestById(followRequestId: string, txSession: any): Promise<FollowRequestModel | null>;
    findFollowRequestByUserAndRequester(userId: string, requesterId: string, txSession: any): Promise<FollowRequestModel | null>;
    findFollowRequestRecordsByUserId(userId: string, txSession: any): Promise<FollowRequestListItem[]>;
    findFollowRequestRecordsByUserIdAndRequestStatus(userId: string, requestStatus: FollowRequestStatus, txSession: any): Promise<FollowRequestListItem[]>;
}