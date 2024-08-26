import { IFollowRepository } from "../../../../../domain/repositories/interfaces/follow-repository";
import { FollowModel } from "../../../../../domain/models/follow";
import { IFollowDataSource } from "../../../../data-access/data-sources/interfaces/follow-data-source"
import { ITransactionController } from "../../mongoose-transaction-controller";


export class FollowMongooseRepository implements IFollowRepository {

    private dataSource: IFollowDataSource
    constructor(dataSource: IFollowDataSource) {
        this.dataSource = dataSource
    }

    getTransactionController(): ITransactionController {
        return this.dataSource.getTransactionController();
    }

    async checkIfUserIsFollowedByFollower(userId: string, followerId: string, txSession = null): Promise<boolean> {
        return await this.findFollowRecordByUserAndFollower(userId, followerId, txSession) != null;
    }

    async createFollowRecord(userId: string, followerId: string, txSession = null): Promise<FollowModel> {
        return await this.dataSource.createFollowRecord(userId, followerId, txSession);
    }

    async findFollowRecordByUserAndFollower(userId: string, followerId: string, txSession = null): Promise<FollowModel | null> {
        return await this.dataSource.findFollowRecordByUserAndFollower(userId, followerId, txSession);
    }

    async findFollowRecordsForUser(userId: string, txSession = null): Promise<FollowModel[]> {
        return await this.dataSource.findFollowRecordsByUserId(userId, txSession);
    }
}