import { CreateUserRequestModel } from "../../../../domain/models/createUserRequest";
import { UserModel } from "../../../../domain/models/user";
import { ITransactionDataSource } from "./transaction-data-source";


export interface IUserDataSource extends ITransactionDataSource {
    create(userData: CreateUserRequestModel, txSession: any): Promise<UserModel>;
    findOneUserByEmail(email: string, txSession: any): Promise<UserModel | null>;
    findOneUserById(email: string, txSession: any): Promise<UserModel | null>;
}