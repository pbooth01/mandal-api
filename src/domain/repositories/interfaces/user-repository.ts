import { CreateUserRequestModel } from "../../models/createUserRequest";
import { UserModel } from "../../models/user";
import { ITransactionRepository } from "./transaction-repository";

export interface IUserRepository extends ITransactionRepository {
    createUser(createUserReq: CreateUserRequestModel, txSession?: any): Promise<UserModel>;
    findUserByEmail(email: string, txSession?: any): Promise<UserModel | null>;
    findUserById(id: string, txSession?: any): Promise<UserModel | null>;
}