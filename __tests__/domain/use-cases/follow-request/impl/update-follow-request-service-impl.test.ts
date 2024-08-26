import { IFollowRepository } from "../../../../../src/domain/repositories/interfaces/follow-repository";
import { IFollowRequestRepository } from "../../../../../src/domain/repositories/interfaces/follow-request-repository";
import { UpdateFollowRequestServiceImpl } from "../../../../../src/domain/use-cases/follow-request/impl/update-follow-request-status-service-impl";
import { ApplicationBaseError } from "../../../../../src/domain/errors/application-base-error";
import { GenericHTTPErrorDefinitions } from "../../../../../src/domain/errors/generic-http-error-definitions";
import { FollowModel } from "../../../../../src/domain/models/follow";
import { FollowRequestModel } from "../../../../../src/domain/models/followRequest";
import { FollowRequestListItem } from "../../../../../src/domain/models/followRequestListItem";
import { FollowRequestStatus } from "../../../../../src/domain/types/follow-request-status";
import { ITransactionController } from "../../../../../src/domain/interfaces/transactionController";

class MockFollowRequestRepository implements IFollowRequestRepository {
    getTransactionController(): ITransactionController {
        throw new Error("Method not implemented.");
    }
    createFollowRequest(userId: string, requesterId: string): Promise<FollowRequestModel> {
        throw new Error("Method not implemented.");
    }
    findFollowRequestById(followRequestId: string): Promise<FollowRequestModel | null> {
        throw new Error("Method not implemented.");
    }
    createFollowRecordcreateFollowRequest(userId: string, requesterId: string): Promise<FollowRequestModel> {
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

class MockFollowRepository implements IFollowRepository {
    getTransactionController(): ITransactionController {
        throw new Error("Method not implemented.");
    }
    createFollowRecord(userId: string, followerId: string): Promise<FollowModel> {
        throw new Error("Method not implemented.");
    }
    checkIfUserIsFollowedByFollower(userId: string, followerId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findFollowRecordByUserAndFollower(userId: string, followerId: string): Promise<FollowModel | null> {
        throw new Error("Method not implemented.");
    }
    findFollowRecordsForUser(userId: string): Promise<FollowModel[]> {
        throw new Error("Method not implemented.");
    }
}

class MockTransactionController implements ITransactionController {
    txSession: any;
    async startTransaction(opts: any): Promise<void> {
        return;
    }
    commitTransaction(): void {
        return;
    }
    abortTransaction(): void {
        return;
    }
    async endSession(): Promise<void> {
        return;
    } 
}

describe("Update Follow Request Service Tests", () => {
    const followRequestRepository = new MockFollowRequestRepository();
    const followRepository = new MockFollowRepository();
    const transactionController = new MockTransactionController();
    const updateFollowRequestUseCase = new UpdateFollowRequestServiceImpl(followRequestRepository, followRepository);

    const existingFollowRequest: FollowRequestModel = {
        _id: "1",
        user: "123",
        followRequester: "1234",
        requestStatus: FollowRequestStatus.PENDING
    }

    const acceptedFollowRequest: FollowRequestModel = {
        _id: "1",
        user: "123",
        followRequester: "1234",
        requestStatus: FollowRequestStatus.ACCEPTED
    }

    const existingFollowRecord: FollowModel = {
        _id: "1",
        user: "123",
        follower: "123"
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("Given that update follow request is called on a non existent follow request", () => {
        it("Should throw an Error GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND", async () => {
            jest.spyOn(followRequestRepository, "findFollowRequestById").mockImplementation((requesterId: string) => Promise.resolve(null));
            jest.spyOn(followRequestRepository, "updateStatusOfFollowRequest");
            jest.spyOn(followRepository, "createFollowRecord");
            expect.assertions(2);

            try {
                const updatedFollowRequest = await updateFollowRequestUseCase.execute("123", "1234", FollowRequestStatus.ACCEPTED);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND.code);
            }
        });

        it("Should not call updateStatusOfFollowRequest or createFollowRecord", async () => {
            jest.spyOn(followRequestRepository, "findFollowRequestById").mockImplementation((requesterId: string) => Promise.resolve(null));
            jest.spyOn(followRequestRepository, "updateStatusOfFollowRequest");
            jest.spyOn(followRepository, "createFollowRecord");
            expect.assertions(4);

            try {
                const updatedFollowRequest = await updateFollowRequestUseCase.execute("123", "1234", FollowRequestStatus.ACCEPTED);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND.code);
            }
            expect(followRequestRepository.updateStatusOfFollowRequest).toBeCalledTimes(0);
            expect(followRepository.createFollowRecord).toBeCalledTimes(0);
        });
    });

    describe("Given that update follow request is called on an existing follow request", () => {
        describe("Given that there is not an existing Follow REcord in the database", () => {
            describe("Given that the logged in user is trying to change the status of a request where they are not the user", () => {
                it("Should throw an Error GenericHTTPErrorDefinitions.FORBIDDEN", async () => {
                    jest.spyOn(followRequestRepository, "findFollowRequestById").mockImplementation((requesterId: string) => Promise.resolve(existingFollowRequest));
                    jest.spyOn(followRequestRepository, "updateStatusOfFollowRequest");
                    jest.spyOn(followRepository, "createFollowRecord");
                    expect.assertions(2);
        
                    try {
                        const updatedFollowRequest = await updateFollowRequestUseCase.execute("1234", "1", FollowRequestStatus.ACCEPTED);
                    }
                    catch(error){
                        expect(error).toBeInstanceOf(ApplicationBaseError);
                        expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                    }
                });
        
                it("Should not call updateStatusOfFollowRequest or createFollowRecord", async () => {
                    jest.spyOn(followRequestRepository, "findFollowRequestById").mockImplementation((requesterId: string) => Promise.resolve(existingFollowRequest));
                    jest.spyOn(followRequestRepository, "updateStatusOfFollowRequest");
                    jest.spyOn(followRepository, "createFollowRecord");
                    expect.assertions(4);
        
                    try {
                        const updatedFollowRequest = await updateFollowRequestUseCase.execute("1234", "1234", FollowRequestStatus.ACCEPTED);
                    }
                    catch(error){
                        expect(error).toBeInstanceOf(ApplicationBaseError);
                        expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                    }
                    expect(followRequestRepository.updateStatusOfFollowRequest).toBeCalledTimes(0);
                    expect(followRepository.createFollowRecord).toBeCalledTimes(0);
                });
            });
            describe("Given that the logged in user is trying to change the status of a request where they are the user", () => {
                describe("Gvien that the requested status is not ACCEPTED", () => {
                    it("Should call updateStatusOfFollowRequest 1 time and createFollowRecord 0 times", async () => {
                        jest.spyOn(followRequestRepository, "findFollowRequestById").mockImplementation((requesterId: string) => Promise.resolve(existingFollowRequest));
                        jest.spyOn(followRequestRepository, "updateStatusOfFollowRequest").mockImplementation((requesterId: string, requestStatus: FollowRequestStatus) => Promise.resolve(existingFollowRequest));
                        jest.spyOn(followRequestRepository, "getTransactionController").mockImplementation(() => transactionController);
                        jest.spyOn(followRepository, "createFollowRecord");
                        jest.spyOn(followRepository, "findFollowRecordByUserAndFollower").mockImplementation((userId: string, requesterId: string) => Promise.resolve(null));
            
                        const updatedFollowRequest = await updateFollowRequestUseCase.execute("123", "1234", FollowRequestStatus.DECLINED);
    
                        expect(followRequestRepository.updateStatusOfFollowRequest).toBeCalledTimes(1);
                        expect(followRepository.createFollowRecord).toBeCalledTimes(0);
                    });
                });
                describe("Gvien that the requested status is ACCEPTED", () => {
                    it("Should return the updatedFollowRequestObject", async () => {
                        jest.spyOn(followRequestRepository, "findFollowRequestById").mockImplementation((requesterId: string) => Promise.resolve(existingFollowRequest));
                        jest.spyOn(followRequestRepository, "updateStatusOfFollowRequest").mockImplementation((requesterId: string, requestStatus: FollowRequestStatus) => Promise.resolve(acceptedFollowRequest));
                        jest.spyOn(followRequestRepository, "getTransactionController").mockImplementation(() => transactionController);
                        jest.spyOn(followRepository, "createFollowRecord").mockImplementation((userId: string, requesterId: string) => Promise.resolve(existingFollowRecord));
                        jest.spyOn(followRepository, "findFollowRecordByUserAndFollower").mockImplementation((userId: string, requesterId: string) => Promise.resolve(null));
                                
                        const updatedFollowRequest = await updateFollowRequestUseCase.execute("123", "1234", FollowRequestStatus.ACCEPTED);
    
                        expect(updatedFollowRequest).toStrictEqual(acceptedFollowRequest);
                    });
                    it("Should call updateStatusOfFollowRequest and createFollowRecord 1 time", async () => {
                        jest.spyOn(followRequestRepository, "findFollowRequestById").mockImplementation((requesterId: string) => Promise.resolve(existingFollowRequest));
                        jest.spyOn(followRequestRepository, "updateStatusOfFollowRequest").mockImplementation((requesterId: string, requestStatus: FollowRequestStatus) => Promise.resolve(acceptedFollowRequest));
                        jest.spyOn(followRequestRepository, "getTransactionController").mockImplementation(() => transactionController);
                        jest.spyOn(followRepository, "createFollowRecord").mockImplementation((userId: string, requesterId: string) => Promise.resolve(existingFollowRecord));
                        jest.spyOn(followRepository, "findFollowRecordByUserAndFollower").mockImplementation((userId: string, requesterId: string) => Promise.resolve(null));
                                
                        const updatedFollowRequest = await updateFollowRequestUseCase.execute("123", "1234", FollowRequestStatus.ACCEPTED);
    
                        expect(followRequestRepository.updateStatusOfFollowRequest).toBeCalledTimes(1);
                        expect(followRepository.createFollowRecord).toBeCalledTimes(1);
                    });
    
                    describe("Given that createFollowRecord throws an exception", () => {
                        it("Should call abortTransaction 1 time", async () => {
                            jest.spyOn(followRequestRepository, "findFollowRequestById").mockImplementation((requesterId: string) => Promise.resolve(existingFollowRequest));
                            jest.spyOn(followRequestRepository, "updateStatusOfFollowRequest").mockImplementation((requesterId: string, requestStatus: FollowRequestStatus) => Promise.resolve(acceptedFollowRequest));
                            jest.spyOn(followRequestRepository, "getTransactionController").mockImplementation(() => transactionController);
                            jest.spyOn(followRepository, "createFollowRecord").mockImplementation((userId: string, requesterId: string) => {throw new Error("Unexpected Error Ocurred")});
                            jest.spyOn(followRepository, "findFollowRecordByUserAndFollower").mockImplementation((userId: string, requesterId: string) => Promise.resolve(null));
                            jest.spyOn(transactionController, "abortTransaction");
                            jest.spyOn(transactionController, "commitTransaction");
                            expect.assertions(5);
                            
                            try {
                                const updatedFollowRequest = await updateFollowRequestUseCase.execute("123", existingFollowRequest._id, FollowRequestStatus.ACCEPTED);
                            }catch(error){
                                expect(error).toHaveProperty("message", "Unexpected Error Ocurred");
                            }
                            
        
                            expect(followRequestRepository.updateStatusOfFollowRequest).toBeCalledTimes(1);
                            expect(followRequestRepository.updateStatusOfFollowRequest).toHaveBeenNthCalledWith(1, existingFollowRequest._id, acceptedFollowRequest.requestStatus, undefined);
                            expect(transactionController.abortTransaction).toBeCalledTimes(1);
                            expect(transactionController.commitTransaction).toBeCalledTimes(0);
                        });
                    });
                });
            });
        })
    });
});