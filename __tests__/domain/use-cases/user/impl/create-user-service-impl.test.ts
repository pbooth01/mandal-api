import { IUserRepository } from "../../../../../src/domain/repositories/interfaces/user-repository";
import { CreateUserServiceImpl } from "../../../../../src/domain/use-cases/user/impl/create-user-service-impl";
import { ApplicationBaseError } from "../../../../../src/domain/errors/application-base-error";
import { UserErrorDefinitions } from "../../../../../src/domain/errors/user-error-definitions";
import { CreateUserRequestModel } from "../../../../../src/domain/models/createUserRequest";
import { UserModel } from "../../../../../src/domain/models/user";
import { ITransactionController } from "../../../../../src/domain/interfaces/transactionController";

class MockUserRepository implements IUserRepository {
    getTransactionController(): ITransactionController {
        throw new Error("Method not implemented.");
    }
    createUser(userData: CreateUserRequestModel): Promise<UserModel> {
        throw new Error("Method not implemented.");
    }
    findUserByEmail(email: string): Promise<UserModel | null> {
        throw new Error("Method not implemented.");
    }
    findUserById(email: string): Promise<UserModel | null> {
        throw new Error("Method not implemented.");
    }
}

describe("Create User Service Tests", () => {
    const userRepository = new MockUserRepository();
    const createUserUseCase = new CreateUserServiceImpl(userRepository);
    const createUserRequestObject: CreateUserRequestModel = {"name": "user1", "email": "user1@gamil.com"};
    const createUserResponseObject: UserModel = {_id:"1", ...createUserRequestObject}

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("Given that findUserByEmail returns an existing user", () => {

        it("Should throw an Error UserErrorDefinitions.EMAIL_ALREADY_TAKEN", async () => {
            jest.spyOn(userRepository, "createUser").mockImplementation((newUser: CreateUserRequestModel) => Promise.resolve(createUserResponseObject));
            jest.spyOn(userRepository, "findUserByEmail").mockImplementation((email: string) => Promise.resolve(createUserResponseObject));
            expect.assertions(2);

            try {
                const newUser = await createUserUseCase.execute(createUserRequestObject);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", UserErrorDefinitions.EMAIL_ALREADY_TAKEN.code);
            }
        });

        it("Should not call create user at all", async () => {
            jest.spyOn(userRepository, "createUser").mockImplementation((newUser: CreateUserRequestModel) => Promise.resolve(createUserResponseObject));
            jest.spyOn(userRepository, "findUserByEmail").mockImplementation((email: string) => Promise.resolve(createUserResponseObject));
            expect.assertions(3);

            try {
                const newUser = await createUserUseCase.execute(createUserRequestObject);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", UserErrorDefinitions.EMAIL_ALREADY_TAKEN.code);
            }
            expect(userRepository.createUser).toBeCalledTimes(0);
        });
    });  

    describe("Given that findUserByEmail returns null", () => {

        it("Should call create user 1 time", async () => {
            jest.spyOn(userRepository, "createUser").mockImplementation((newUser: CreateUserRequestModel) => Promise.resolve(createUserResponseObject));
            jest.spyOn(userRepository, "findUserByEmail").mockImplementation((email: string) => Promise.resolve(null));
            expect.assertions(1);

            try {
                const newUser = await createUserUseCase.execute(createUserRequestObject);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", UserErrorDefinitions.EMAIL_ALREADY_TAKEN.code);
            }
            expect(userRepository.createUser).toBeCalledTimes(1);
        });

        it("Should recieve a the newly created user object from the service", async () => {
            jest.spyOn(userRepository, "createUser").mockImplementation((newUser: CreateUserRequestModel) => Promise.resolve(createUserResponseObject));
            jest.spyOn(userRepository, "findUserByEmail").mockImplementation((email: string) => Promise.resolve(null));
            expect.assertions(1);
            try {
                const newUser = await createUserUseCase.execute(createUserRequestObject);
                expect(newUser).toStrictEqual(createUserResponseObject);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", UserErrorDefinitions.EMAIL_ALREADY_TAKEN.code);
            }
            
        });
    }); 
});