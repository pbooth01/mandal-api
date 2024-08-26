import { CreateUserRequestModel } from "../../../../../domain/models/createUserRequest";
import { UserModel } from "../../../../../domain/models/user";
import { ITransactionController, MongooseTransactionController } from "../../../../driven-adapters/adapters/mongoose-transaction-controller";
import { IMongoDBConnector } from "../../../../driven-adapters/adapters/orm/mongoose/interfaces/mongodb-connector";
import { IUserMongooseModel } from "../../../../driven-adapters/adapters/orm/mongoose/schemas/user";
import { IUserDataSource } from "../../interfaces/user-data-source";


export class MongoDBUserDataSource implements IUserDataSource {
    
    private dbConnector: IMongoDBConnector
    private userModel: IUserMongooseModel;
    constructor(dbConnector: IMongoDBConnector) {
        this.dbConnector = dbConnector;
        this.userModel = this.dbConnector.connection.model('User');
    }

    getTransactionController(): ITransactionController {
        return new MongooseTransactionController(this.dbConnector);
    }

    async create(userData: CreateUserRequestModel, txSession: any = null): Promise<UserModel> {
        const [newUser] = await this.userModel.create([userData], {session: txSession})
        return newUser.userDomainModel();
    }

    async findOneUserByEmail(email: string, txSession: any = null): Promise<UserModel | null> {
        const foundUser = await this.userModel.findOne({ email: email }, {}, {session: txSession});
        return foundUser === null ? foundUser : foundUser.userDomainModel();
    }

    async findOneUserById(id: string, txSession: any = null): Promise<UserModel | null> {
        const foundUser = await this.userModel.findById(id, {}, {session: txSession});
        return foundUser === null ? foundUser : foundUser.userDomainModel();
    }
    
}