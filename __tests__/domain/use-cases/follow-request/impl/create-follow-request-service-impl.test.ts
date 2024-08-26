import { IFollowRequestRepository } from "../../../../../src/domain/repositories/interfaces/follow-request-repository";
import { CreateFollowRequestServiceImpl } from "../../../../../src/domain/use-cases/follow-request/impl/create-follow-request-service-impl";
import { ApplicationBaseError } from "../../../../../src/domain/errors/application-base-error";
import { FollowRequestErrorDefinitions } from "../../../../../src/domain/errors/follow-request-error-definitions";
import { GenericHTTPErrorDefinitions } from "../../../../../src/domain/errors/generic-http-error-definitions";
import { FollowRequestModel } from "../../../../../src/domain/models/followRequest";
import { FollowRequestListItem } from "../../../../../src/domain/models/followRequestListItem";
import { FollowRequestStatus } from "../../../../../src/domain/types/follow-request-status";
import { ITransactionController } from "../../../../../src/domain/interfaces/transactionController";

class MockFollowRequestRepository implements IFollowRequestRepository {
    getTransactionController(): ITransactionController {
        throw new Error("Method not implemented.");
    }
    findFollowRequestById(followRequestId: string): Promise<FollowRequestModel | null> {
        throw new Error("Method not implemented.");
    }
    createFollowRequest(userId: string, requesterId: string): Promise<FollowRequestModel> {
        throw new Error("Method not implemented.");
    }
    updateStatusOfFollowRequest(requestId: string, status: FollowRequestStatus): Promise<FollowRequestModel | null> {
        throw new Error("Method not implemented.");
    }
    findFollowRequestByUserAndRequester(userId: string, requesterId: string): Promise<FollowRequestModel | null> {
        throw new Error("Method not implemented.");
    }
    findFollowRequestRecordsByUserId(userId: string): Promise<FollowRequestListItem[]> {
        throw new Error("Method not implemented.");
    }
    findFollowRequestRecordsByUserIdAndRequestStatus(userId: string, requestStatus: FollowRequestStatus): Promise<FollowRequestListItem[]> {
        throw new Error("Method not implemented.");
    }
    
}

describe("Create Follow Request Service Tests", () => {
    const followRequestRepository = new MockFollowRequestRepository();
    const createFollowRequestUseCase = new CreateFollowRequestServiceImpl(followRequestRepository);

    const createFollowResponse: FollowRequestModel = {
        _id: "1",
        user: "123",
        followRequester: "1234",
        requestStatus: FollowRequestStatus.PENDING
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("Given that findFollowRequestByUserAndRequester returns an existing follow request", () => {

        it("Should throw an Error FollowRequestErrorDefinitions.EXISTING_FOLLOW_REQUEST", async () => {
            jest.spyOn(followRequestRepository, "findFollowRequestByUserAndRequester").mockImplementation((userId: string, requesterId: string) => Promise.resolve(createFollowResponse));
            expect.assertions(2);

            try {
                const newFollowRequest = await createFollowRequestUseCase.execute("1234", "1234");
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", FollowRequestErrorDefinitions.EXISTING_FOLLOW_REQUEST.code);
            }
        });

        it("Should not call create follow request at all", async () => {
            jest.spyOn(followRequestRepository, "createFollowRequest").mockImplementation((userId: string, requesterId: string) => Promise.resolve(createFollowResponse));
            jest.spyOn(followRequestRepository, "findFollowRequestByUserAndRequester").mockImplementation((userId: string, requesterId: string) => Promise.resolve(createFollowResponse));
            expect.assertions(3);

            try {
                const newFollowRequest = await createFollowRequestUseCase.execute("1234", "1234");
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", FollowRequestErrorDefinitions.EXISTING_FOLLOW_REQUEST.code);
            }
            expect(followRequestRepository.createFollowRequest).toBeCalledTimes(0);
        });
    });  

    describe("Given that findFollowRequestByUserAndRequester returns null", () => {
        describe("Given that a user tries to create a follow request to follow themselves", () => {
            it("Should throw an Error GenericHTTPErrorDefinitions.BAD_REQUEST", async () => {
                jest.spyOn(followRequestRepository, "createFollowRequest").mockImplementation((userId: string, requesterId: string) => Promise.resolve(createFollowResponse));
                jest.spyOn(followRequestRepository, "findFollowRequestByUserAndRequester").mockImplementation((userId: string, requesterId: string) => Promise.resolve(null));
                expect.assertions(2);
    
                try {
                    const newFollowRequest = await createFollowRequestUseCase.execute("1234", "1234");
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.BAD_REQUEST.code);
                }
            });
    
            it("Should call createFollowRequest 0 times", async () => {
                jest.spyOn(followRequestRepository, "createFollowRequest").mockImplementation((userId: string, requesterId: string) => Promise.resolve(createFollowResponse));
                jest.spyOn(followRequestRepository, "findFollowRequestByUserAndRequester").mockImplementation((userId: string, requesterId: string) => Promise.resolve(null));
                expect.assertions(3);
    
                try {
                    const newFollowRequest = await createFollowRequestUseCase.execute("1234", "1234");
                    expect(newFollowRequest).toStrictEqual(createFollowResponse);
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.BAD_REQUEST.code);
                }
                expect(followRequestRepository.createFollowRequest).toBeCalledTimes(0);
                
            });
        });
        
        describe("Given that a user is trying to create a follow request for an id that is not their own", () => {
            it("Should call createFollowRequest 1 time", async () => {
                jest.spyOn(followRequestRepository, "createFollowRequest").mockImplementation((userId: string, requesterId: string) => Promise.resolve(createFollowResponse));
                jest.spyOn(followRequestRepository, "findFollowRequestByUserAndRequester").mockImplementation((userId: string, requesterId: string) => Promise.resolve(null));
                expect.assertions(1);
    
                try {
                    const newFollowRequest = await createFollowRequestUseCase.execute("1234", "123");
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", FollowRequestErrorDefinitions.EXISTING_FOLLOW_REQUEST.code);
                }
                expect(followRequestRepository.createFollowRequest).toBeCalledTimes(1);
            });
    
            it("Should recieve a the newly created user object from the service", async () => {
                jest.spyOn(followRequestRepository, "createFollowRequest").mockImplementation((userId: string, requesterId: string) => Promise.resolve(createFollowResponse));
                jest.spyOn(followRequestRepository, "findFollowRequestByUserAndRequester").mockImplementation((userId: string, requesterId: string) => Promise.resolve(null));
                expect.assertions(2);
    
                try {
                    const newFollowRequest = await createFollowRequestUseCase.execute("1234", "123");
                    expect(newFollowRequest).toStrictEqual(createFollowResponse);
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", FollowRequestErrorDefinitions.EXISTING_FOLLOW_REQUEST.code);
                }
                expect(followRequestRepository.createFollowRequest).toBeCalledTimes(1);
                
            });
        }); 
    }); 
});