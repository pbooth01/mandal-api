import { UserModel } from "../../../models/user";
import { CreateUserRequestModel } from "../../../models/createUserRequest";
import { IUserRepository } from "../../../repositories/interfaces/user-repository";
import { ICreateUserService } from "../interfaces/create-user-service";
import { ApplicationBaseError } from "../../../errors/application-base-error";
import { UserErrorDefinitions } from "../../../errors/user-error-definitions";

export class CreateUserServiceImpl implements ICreateUserService {
    constructor(
        private readonly userRepository: IUserRepository
    ) {
    }

    async execute(newUserData: CreateUserRequestModel): Promise<UserModel> {
        const existingUser = await this.userRepository.findUserByEmail(newUserData.email);
        if(existingUser !== null){
            throw new ApplicationBaseError(UserErrorDefinitions.EMAIL_ALREADY_TAKEN);
        }
        return await this.userRepository.createUser(newUserData);
    }
}