import { UserModel } from "./user";

export type CreateUserRequestModel = Omit<UserModel, '_id'>