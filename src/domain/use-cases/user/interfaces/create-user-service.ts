import { CreateUserRequestModel } from "../../../models/createUserRequest";
import { UserModel } from "../../../models/user";

export interface ICreateUserService {
  execute: (userData: CreateUserRequestModel) => Promise<UserModel>
}