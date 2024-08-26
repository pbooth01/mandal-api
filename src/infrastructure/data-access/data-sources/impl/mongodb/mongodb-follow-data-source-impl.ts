import { FollowModel } from "../../../../../domain/models/follow";
import { ITransactionController, MongooseTransactionController } from "../../../../driven-adapters/adapters/mongoose-transaction-controller";
import { IMongoDBConnector } from "../../../../driven-adapters/adapters/orm/mongoose/interfaces/mongodb-connector";
import { IFollowMongooseModel } from "../../../../driven-adapters/adapters/orm/mongoose/schemas/follow";
import { IFollowDataSource } from "../../interfaces/follow-data-source";

export class MongoDBFollowDataSource implements IFollowDataSource {

    private dbConnector: IMongoDBConnector
    private followModel: IFollowMongooseModel;
    constructor(dbConnector: IMongoDBConnector) {
        this.dbConnector = dbConnector;
        this.followModel = this.dbConnector.connection.model('Follow');
    }

    getTransactionController(): ITransactionController {
        return new MongooseTransactionController(this.dbConnector);
    }

    async createFollowRecord(userId: string, followerId: string, txSession: any = null): Promise<FollowModel> {
        const [followRecord] = await this.followModel.create([{
             user: userId,
             follower: followerId
        }],{session: txSession});
        return followRecord.followDomainModel();
    }

    async findFollowRecordByUserAndFollower(userId: string, followerId: string, txSession: any = null): Promise<FollowModel | null> {
        const followRecord = await this.followModel.findOne({
             user: userId,
             follower: followerId
        },{},{session: txSession});
        return followRecord === null ? followRecord : followRecord.followDomainModel();
    }

    async findFollowRecordsByUserId(userId: string, txSession: any = null): Promise<FollowModel[]> {
        const followRecords = await this.followModel.find({
            user: userId
        }, {}, {session: txSession});
        return followRecords.map((doc) => doc.followDomainModel());
    }  
}