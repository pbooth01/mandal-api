import { FollowModel } from "../../models/follow";
import { ITransactionRepository } from "./transaction-repository";

export interface IFollowRepository extends ITransactionRepository {
    createFollowRecord(userId: string, followerId: string, txSession?: any): Promise<FollowModel>;
    checkIfUserIsFollowedByFollower(userId: string, followerId: string, txSession?: any): Promise<boolean>;
    findFollowRecordByUserAndFollower(userId: string, followerId: string, txSession?: any): Promise<FollowModel | null>;
    findFollowRecordsForUser(userId: string, txSession?: any): Promise<FollowModel[]>;
}