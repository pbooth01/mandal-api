import { FollowModel } from "../../../../domain/models/follow";
import { ITransactionDataSource } from "./transaction-data-source";

export interface IFollowDataSource extends ITransactionDataSource {
    createFollowRecord(userId: string, followerId: string, txSession: any): Promise<FollowModel>;
    findFollowRecordByUserAndFollower(userId: string, followerId: string, txSession: any): Promise<FollowModel | null>;
    findFollowRecordsByUserId(userId: string, txSession: any): Promise<FollowModel[]>;
}