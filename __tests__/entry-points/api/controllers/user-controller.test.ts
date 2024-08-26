import request from "supertest";
import server from "../../../../src/application/server";
import { CreateUserRequestModel } from "../../../../src/domain/models/createUserRequest";
import { UserModel } from "../../../../src/domain/models/user";
import { ICreateUserService } from "../../../../src/domain/use-cases/user/interfaces/create-user-service";
import { UserController } from "../../../../src/entry-points/api/controllers/user-controller";
import UserRouter from "../../../../src/entry-points/api/routes/user-router";
import { AJVSchemaValidator } from "../../../../src/infrastructure/driven-adapters/adapters/validators/ajv-schema-validator";
import { ISchemaValidator } from "../../../../src/application/validator/interfaces/schema-validator";
import { ApplicationBaseError } from "../../../../src/domain/errors/application-base-error";
import { UserErrorDefinitions } from "../../../../src/domain/errors/user-error-definitions";
import { FollowRequestController } from "../../../../src/entry-points/api/controllers/follow-request-controller";
import { IGetFollowRequestsService } from "../../../../src/domain/use-cases/follow-request/interfaces/get-follow-requests";
import { FollowRequestModel } from "../../../../src/domain/models/followRequest";
import { FollowRequestStatus } from "../../../../src/domain/types/follow-request-status";
import { ICreateFollowRequestService } from "../../../../src/domain/use-cases/follow-request/interfaces/create-follow-request";
import { IUpdateFollowRequestStatusService } from "../../../../src/domain/use-cases/follow-request/interfaces/update-follow-request-status";
import { FollowRequestListItem } from "../../../../src/domain/models/followRequestListItem";
import { IUserAuthenticationService } from "../../../../src/domain/interfaces/userAuthenticationService";

class MockCreateUserService implements ICreateUserService {
    execute(userData: CreateUserRequestModel): Promise<UserModel> {
        throw new Error("Method not implemented.");
    }
}

class MockGetFollowRequestsService implements IGetFollowRequestsService {
    execute(sessionUserId: string, requestStatus: FollowRequestStatus): Promise<FollowRequestListItem[]> {
        throw new Error("Method not implemented.");
    }
}

class MockCreateFollowRequestService implements ICreateFollowRequestService {
    execute(sessionUserId: string, userId: string): Promise<FollowRequestModel> {
        throw new Error("Method not implemented.");
    } 
}

class MockUpdateFollowRequestService implements IUpdateFollowRequestStatusService {
    execute(sessionUserId: string, requestId: string, requestStatus: FollowRequestStatus): Promise<FollowRequestModel> {
        throw new Error("Method not implemented.");
    } 
}

class MockAuthUserService implements IUserAuthenticationService {
    getLoggedInUser(idToReflect: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}

describe("User Controller Tests", () => {
    let mockCreateUserUseCase: ICreateUserService;
    let mockCreateFollowRequestService: ICreateFollowRequestService;
    let mockGetFollowRequestsService: IGetFollowRequestsService;
    let mockUpdateFollowRequestService: IUpdateFollowRequestStatusService;
    let ajvValidatorService: ISchemaValidator;
    let mockAuthService: IUserAuthenticationService;

    beforeAll(() => {
        mockCreateUserUseCase = new MockCreateUserService();
        mockCreateFollowRequestService = new MockCreateFollowRequestService();
        mockGetFollowRequestsService = new MockGetFollowRequestsService();
        mockUpdateFollowRequestService = new MockUpdateFollowRequestService();
        ajvValidatorService = new AJVSchemaValidator();
        mockAuthService = new MockAuthUserService();

        const userMiddleWare = UserRouter(
            new UserController(
                mockCreateUserUseCase,
                ajvValidatorService
            ),
            new FollowRequestController(
                mockGetFollowRequestsService,
                mockCreateFollowRequestService,
                mockUpdateFollowRequestService,
                ajvValidatorService,
                mockAuthService
            )
        );

        server.use("/api/v1/users", userMiddleWare)
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("Calls to endpoint /api/v1/users", () => {

        describe("Given a Valid Create User Request", () => {
            it("it should call createUser once, return a 201 response code", async () => {
                const createUserRequest = { name: "User1", email: "User1@gmail.com" };
                const createUserResponse = {_id: "1", ...createUserRequest};
                jest.spyOn(mockCreateUserUseCase, "execute").mockImplementation(() => Promise.resolve(createUserResponse))
    
                const response = await request(server)
                                        .post("/api/v1/users")
                                        .send(createUserRequest)
    
                expect(mockCreateUserUseCase.execute).toBeCalledTimes(1);
                expect(mockCreateUserUseCase.execute).toBeCalledWith(createUserRequest);
                expect(response.status).toBe(201);
                expect(response.body.data).toStrictEqual(createUserResponse);
            });
        });

        describe("Given an invalid Create User Request", () => {
            it("it should call createUser zero times and return a 400 response code", async () => {
                const invalidCreateUserRequest = { email: "User1@gmail.com" };
                const createUserResponse = {_id: "1", name: "user1", ...invalidCreateUserRequest}

                jest.spyOn(mockCreateUserUseCase, "execute").mockImplementation(() => Promise.resolve(createUserResponse))
    
                const response = await request(server)
                                        .post("/api/v1/users")
                                        .send(invalidCreateUserRequest)
    
                expect(mockCreateUserUseCase.execute).toBeCalledTimes(0);
                expect(response.status).toBe(400);
            });
        });

        describe("Given a Valid Create User Request for an existing User", () => {
            it("it should call createUser 1 time and return a 400 response code", async () => {
                const createUserRequest = { name: "User1", email: "User1@gmail.com" };
                const createUserResponse = {_id: "1", ...createUserRequest}

                jest.spyOn(mockCreateUserUseCase, "execute").mockImplementation(() => { throw new ApplicationBaseError(UserErrorDefinitions.EMAIL_ALREADY_TAKEN)})
    
                const response = await request(server)
                                        .post("/api/v1/users")
                                        .send(createUserRequest)
    
                expect(mockCreateUserUseCase.execute).toBeCalledTimes(1);
                expect(response.status).toBe(400);
                expect(response).toHaveProperty("error");
                expect(response.body.error.code).toBe(UserErrorDefinitions.EMAIL_ALREADY_TAKEN.code);
            });
        });
    })
})