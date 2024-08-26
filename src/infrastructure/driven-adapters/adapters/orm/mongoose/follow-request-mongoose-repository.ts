import { IFollowRequestRepository } from "../../../../../domain/repositories/interfaces/follow-request-repository";
import { FollowRequestModel as FollowRequestDomainModel } from "../../../../../domain/models/followRequest";
import { IFollowRequestDataSource } from "../../../../data-access/data-sources/interfaces/follow-request-data-source";
import { FollowRequestStatus } from "../../../../../domain/types/follow-request-status";
import { FollowRequestListItem } from "../../../../../domain/models/followRequestListItem";
import { ITransactionController} from "../../mongoose-transaction-controller";

export class FollowRequestMongooseRepository implements IFollowRequestRepository {

    private dataSource: IFollowRequestDataSource
    constructor(dataSource: IFollowRequestDataSource) {
        this.dataSource = dataSource
    }

    getTransactionController(): ITransactionController {
        return this.dataSource.getTransactionController();
    }

    async createFollowRequest(userId: string, requesterId: string, txSession = null): Promise<FollowRequestDomainModel> {
        return await this.dataSource.createFollowRequest(userId, requesterId, txSession);
    }

    async updateStatusOfFollowRequest(requestId: string, status: FollowRequestStatus, txSession = null): Promise<FollowRequestDomainModel | null> {
        return await this.dataSource.updateStatusOfFollowRequest(requestId, status, txSession);
    }

    async findFollowRequestById(followRequestId: string, txSession = null): Promise<FollowRequestDomainModel | null> {
        return await this.dataSource.findFollowRequestById(followRequestId, txSession);
    }

    async findFollowRequestByUserAndRequester(userId: string, requesterId: string, txSession = null): Promise<FollowRequestDomainModel | null> {
        return await this.dataSource.findFollowRequestByUserAndRequester(userId, requesterId, txSession);
    }

    async findFollowRequestRecordsByUserId(userId: string, txSession = null): Promise<FollowRequestListItem[]> {
        return await this.dataSource.findFollowRequestRecordsByUserId(userId, txSession);
    }
    
    async findFollowRequestRecordsByUserIdAndRequestStatus(userId: string, requestStatus: FollowRequestStatus, txSession = null): Promise<FollowRequestListItem[]> {
        return await this.dataSource.findFollowRequestRecordsByUserIdAndRequestStatus(userId, requestStatus, txSession);
    }
}