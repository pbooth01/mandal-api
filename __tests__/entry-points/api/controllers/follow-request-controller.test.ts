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
import { FollowRequestController } from "../../../../src/entry-points/api/controllers/follow-request-controller";
import { IGetFollowRequestsService } from "../../../../src/domain/use-cases/follow-request/interfaces/get-follow-requests";
import { FollowRequestModel } from "../../../../src/domain/models/followRequest";
import { FollowRequestStatus } from "../../../../src/domain/types/follow-request-status";
import { ICreateFollowRequestService } from "../../../../src/domain/use-cases/follow-request/interfaces/create-follow-request";
import { IUpdateFollowRequestStatusService } from "../../../../src/domain/use-cases/follow-request/interfaces/update-follow-request-status";
import { FollowRequestListItem } from "../../../../src/domain/models/followRequestListItem";
import { IUserAuthenticationService } from "../../../../src/domain/interfaces/userAuthenticationService";
import { GenericHTTPErrorDefinitions } from "../../../../src/domain/errors/generic-http-error-definitions";

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

describe("Follow Request Controller Tests", () => {
    let mockCreateUserUseCase: ICreateUserService;
    let mockCreateFollowRequestService: ICreateFollowRequestService;
    let mockGetFollowRequestsService: IGetFollowRequestsService;
    let mockUpdateFollowRequestService: IUpdateFollowRequestStatusService;
    let ajvValidatorService: ISchemaValidator;
    let mockAuthService: IUserAuthenticationService;

    const validFollowRequestResponse = {
        _id: "12345",
        user: "12345",
        followRequester: "123",
        requestStatus: FollowRequestStatus.PENDING
    }

    const validFollowRequestListItemResponse = {
        _id: "12345",
        followRequester: {
            _id: "123",
            name: "user1",
            email: "user1@gmail.com"
        },
        requestStatus: FollowRequestStatus.PENDING
    };

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

    describe("Get request to endpoint /api/v1/users/:userId/follow-requests", () => {
        describe("Given that :userId is the same as the authenticated user", () => {
            describe("Given that requestStatus is not provided", () => {
                it("it should call getFollowRequests.execute once with :userID and null", async () => {
                    const userId = "12345";
                    const expectedOutput = [validFollowRequestListItemResponse];
    
                    jest.spyOn(mockGetFollowRequestsService, "execute").mockImplementation((sessionUserId: string, requestStatus: FollowRequestStatus) => Promise.resolve(expectedOutput));
                    jest.spyOn(mockAuthService, "getLoggedInUser").mockImplementation((idToReflect: string) => Promise.resolve(userId));
        
                    const response = await request(server)
                                            .get(`/api/v1/users/${userId}/follow-requests`)
                                            .send()
        
                    expect(mockGetFollowRequestsService.execute).toBeCalledTimes(1);
                    expect(mockGetFollowRequestsService.execute).toBeCalledWith(userId, null);
                    expect(response.statusCode).toBe(200);
                    expect(response.body.data).toStrictEqual(expectedOutput);
                });
            });

            describe("Given that requestStatus is provided", () => {
                it("it should call getFollowRequests.execute once with :userID and requeststatus", async () => {
                    const userId = "12345";
                    const requestStatus = "accepted"
                    const expectedOutput = [validFollowRequestListItemResponse];
    
                    jest.spyOn(mockGetFollowRequestsService, "execute").mockImplementation((sessionUserId: string, requestStatus: FollowRequestStatus) => Promise.resolve(expectedOutput));
                    jest.spyOn(mockAuthService, "getLoggedInUser").mockImplementation((idToReflect: string) => Promise.resolve(userId));
        
                    const response = await request(server)
                                            .get(`/api/v1/users/${userId}/follow-requests`)
                                            .query({requestStatus: requestStatus})
                                            .send()
        
                    expect(mockGetFollowRequestsService.execute).toBeCalledTimes(1);
                    expect(mockGetFollowRequestsService.execute).toBeCalledWith(userId, requestStatus);
                    expect(response.statusCode).toBe(200);
                    expect(response.body.data).toStrictEqual(expectedOutput);
                });
            });
        });

        describe("Given that :userId is not the same as the authenticated user", () => {
            it("it should return an error response of forbidden", async () => {
                const userId = "12345";
                const expectedOutput = [validFollowRequestListItemResponse];

                jest.spyOn(mockGetFollowRequestsService, "execute").mockImplementation((sessionUserId: string, requestStatus: FollowRequestStatus) => Promise.resolve(expectedOutput));
                jest.spyOn(mockAuthService, "getLoggedInUser").mockImplementation((idToReflect: string) => Promise.resolve(userId+"1"));
    
                const response = await request(server)
                                        .get(`/api/v1/users/${userId}/follow-requests`)
                                        .send()
    
                expect(mockGetFollowRequestsService.execute).toBeCalledTimes(0);
                expect(response.statusCode).toBe(403);
                expect(response.body.data).toBe(undefined);
                expect(response).toHaveProperty("error");
                expect(response.body.error.code).toBe(GenericHTTPErrorDefinitions.FORBIDDEN.code);
            });
        });
    });

    describe("Post request to endpoint /api/v1/users/:userId/follow-requests", () => {
        describe("Given that :userId is the same as the authenticated user", () => {
            describe("Given that requestStatus is not provided", () => {
                it("it should call createFollowRequests.execute once with :userID and null", async () => {
                    const sessionUserId = "12346";
                    const userIdTofollow = "12345";
                    const expectedOutput = validFollowRequestResponse;
    
                    jest.spyOn(mockCreateFollowRequestService, "execute").mockImplementation((sessionUserId: string, userToFollow: string) => Promise.resolve(expectedOutput));
                    jest.spyOn(mockAuthService, "getLoggedInUser").mockImplementation((idToReflect: string) => Promise.resolve(sessionUserId));
        
                    const response = await request(server)
                                            .post(`/api/v1/users/${userIdTofollow}/follow-requests`)
                                            .send()
        
                    expect(mockCreateFollowRequestService.execute).toBeCalledTimes(1);
                    expect(mockCreateFollowRequestService.execute).toBeCalledWith(sessionUserId, userIdTofollow);
                    expect(response.statusCode).toBe(201);
                    expect(response.body.data).toStrictEqual(expectedOutput);
                });
            });
        });
    });

    describe("Patch request to endpoint /api/v1/users/:userId/follow-requests/:requestID", () => {
        describe("Given that requestStatus is not provided", () => {
            it("it should throw a validation exception and call createFollowRequests.execute zero times", async () => {
                const sessionUserId = "12346";
                const userIdTofollow = "12345";
                const requestId = "123456"

                const expectedOutput = validFollowRequestResponse;

                jest.spyOn(mockUpdateFollowRequestService, "execute").mockImplementation((sessionUserId: string, userToFollow: string) => Promise.resolve(expectedOutput));
                jest.spyOn(mockAuthService, "getLoggedInUser").mockImplementation((idToReflect: string) => Promise.resolve(sessionUserId));
    
                const response = await request(server)
                                        .patch(`/api/v1/users/${userIdTofollow}/follow-requests/${requestId}`)
                                        .send()
    
                expect(mockUpdateFollowRequestService.execute).toBeCalledTimes(0);
                expect(response.statusCode).toBe(400);
                expect(response.body.error.message).toBe("must have required property 'requestStatus'");
            });
        });

        describe("Given that requestStatus is provided", () => {
            describe("Given that an invalid request status is provided", () => {
                it("it should throw a validation exception and call createFollowRequests.execute zero times", async () => {
                    const sessionUserId = "12346";
                    const userIdTofollow = "12345";
                    const requestId = "123456"
    
                    const expectedOutput = validFollowRequestResponse;
    
                    jest.spyOn(mockUpdateFollowRequestService, "execute").mockImplementation((sessionUserId: string, userToFollow: string) => Promise.resolve(expectedOutput));
                    jest.spyOn(mockAuthService, "getLoggedInUser").mockImplementation((idToReflect: string) => Promise.resolve(sessionUserId));
        
                    const response = await request(server)
                                            .patch(`/api/v1/users/${userIdTofollow}/follow-requests/${requestId}`)
                                            .send({requestStatus: "NONSENSE"})
        
                    expect(mockUpdateFollowRequestService.execute).toBeCalledTimes(0);
                    expect(response.statusCode).toBe(400);
                });
            })

            describe("Given that a valid request status is provided", () => {
                it("it should call createFollowRequests.execute once", async () => {
                    const sessionUserId = "12346";
                    const userIdTofollow = "12345";
                    const requestId = "123456"
                    const requestStatus = "accepted"
    
                    const expectedOutput = validFollowRequestResponse;
    
                    jest.spyOn(mockUpdateFollowRequestService, "execute").mockImplementation((sessionUserId: string, userToFollow: string) => Promise.resolve(expectedOutput));
                    jest.spyOn(mockAuthService, "getLoggedInUser").mockImplementation((idToReflect: string) => Promise.resolve(sessionUserId));
        
                    const response = await request(server)
                                            .patch(`/api/v1/users/${userIdTofollow}/follow-requests/${requestId}`)
                                            .send({requestStatus: requestStatus})
        
                    expect(mockUpdateFollowRequestService.execute).toBeCalledTimes(1);
                    expect(mockUpdateFollowRequestService.execute).toBeCalledWith(sessionUserId, requestId, requestStatus.toUpperCase());
                    expect(response.statusCode).toBe(200);
                    expect(response.body.data).toStrictEqual(expectedOutput);
                });
            })
        });
    });
})
