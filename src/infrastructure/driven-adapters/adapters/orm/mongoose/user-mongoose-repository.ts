import { CreateUserRequestModel } from "../../../../../domain/models/createUserRequest"
import { UserModel } from "../../../../../domain/models/user"
import { IUserRepository } from "../../../../../domain/repositories/interfaces/user-repository"
import { IUserDataSource } from "../../../../data-access/data-sources/interfaces/user-data-source"
import { ITransactionController } from "../../mongoose-transaction-controller"


export class UserMongooseRepository implements IUserRepository {

    private dataSource: IUserDataSource
    constructor(dataSource: IUserDataSource) {
        this.dataSource = dataSource
    }

    getTransactionController(): ITransactionController {
        return this.dataSource.getTransactionController();
    }

    async createUser(data: CreateUserRequestModel, txSession = null): Promise<UserModel> {
        return await this.dataSource.create(data, txSession);
    }

    async findUserByEmail(email: string, txSession = null): Promise<UserModel | null> {
        return await this.dataSource.findOneUserByEmail(email, txSession);
    }

    async findUserById(id: string, txSession = null): Promise<UserModel | null> {
        return await this.dataSource.findOneUserById(id, txSession);
    }
}