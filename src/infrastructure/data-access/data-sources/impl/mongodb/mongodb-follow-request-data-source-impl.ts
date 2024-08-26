import { FollowRequestModel } from "../../../../../domain/models/followRequest";
import { FollowRequestListItem } from "../../../../../domain/models/followRequestListItem";
import { FollowRequestStatus } from "../../../../../domain/types/follow-request-status";
import { IMongoDBConnector } from "../../../../driven-adapters/adapters/orm/mongoose/interfaces/mongodb-connector";
import { IFollowRequestMongooseModel } from "../../../../driven-adapters/adapters/orm/mongoose/schemas/followRequest";
import { ITransactionController, MongooseTransactionController } from "../../../../driven-adapters/adapters/mongoose-transaction-controller";
import { IFollowRequestDataSource } from "../../interfaces/follow-request-data-source";

export class MongoDBFollowRequestDataSource implements IFollowRequestDataSource {

    private dbConnector: IMongoDBConnector
    private followRequestModel: IFollowRequestMongooseModel;
    constructor(dbConnector: IMongoDBConnector) {
        this.dbConnector = dbConnector;
        this.followRequestModel = this.dbConnector.connection.model('FollowRequest');
    }
    
    getTransactionController(): ITransactionController {
        return new MongooseTransactionController(this.dbConnector);
    }

    async createFollowRequest(userId: string, followerId: string, txSession: any = null): Promise<FollowRequestModel> {
        const [followRequest] = await this.followRequestModel.create([{
            user: userId,
            followRequester: followerId
       }],{session: txSession});

       return followRequest.followRequestDomainModel();
    }

    async updateStatusOfFollowRequest(requestId: string, status: FollowRequestStatus, txSession: any = null): Promise<FollowRequestModel | null> {
        await this.followRequestModel.findByIdAndUpdate(requestId, {requestStatus: status},{runValidators: true, session: txSession});
        const followRequest = await this.followRequestModel.findById(requestId, {}, {session: txSession});
        return followRequest === null ? followRequest : followRequest.followRequestDomainModel();
    }

    async findFollowRequestById(requestId: string, txSession: any = null): Promise<FollowRequestModel | null> {
        const followRequest = await this.followRequestModel.findById(requestId, {}, {session: txSession})
        return followRequest === null ? followRequest : followRequest.followRequestDomainModel();
    }

    async findFollowRequestByUserAndRequester(userId: string, requesterId: string, txSession: any = null): Promise<FollowRequestModel | null> {
        const followRequest = await this.followRequestModel.findOne({
            user: userId,
            followRequester: requesterId
       }, {}, {session: txSession});
       return followRequest === null ? followRequest : followRequest.followRequestDomainModel();
    }

    async findFollowRequestRecordsByUserId(userId: string, txSession: any = null): Promise<FollowRequestListItem[]> {
        const followRequests = await this.followRequestModel.find({
            user: userId,
        }, {}, {session: txSession}).populate('followRequester').populate({path:'followRequester'});
        return followRequests.map((doc) => doc.followRequestDomainListItem());
    }

    async findFollowRequestRecordsByUserIdAndRequestStatus(userId: string, requestStatus: FollowRequestStatus, txSession: any = null): Promise<FollowRequestListItem[]> {
        const followRequests = await this.followRequestModel.find({
            user: userId,
            requestStatus: requestStatus
        }, {}, {
            session: txSession}).populate({path:'followRequester'});
        return followRequests.map((doc) => doc.followRequestDomainListItem());
    }
}