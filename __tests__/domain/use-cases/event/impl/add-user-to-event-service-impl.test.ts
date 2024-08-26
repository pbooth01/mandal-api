import { IEventRepository } from "../../../../../src/domain/repositories/interfaces/event-repository";
import { IFollowRepository } from "../../../../../src/domain/repositories/interfaces/follow-repository";
import { AddUserToEventServiceImpl } from "../../../../../src/domain/use-cases/event/impl/add-user-to-event-service-impl";
import { ApplicationBaseError } from "../../../../../src/domain/errors/application-base-error";
import { EventErrorDefinitions } from "../../../../../src/domain/errors/event-error-definitions";
import { GenericHTTPErrorDefinitions } from "../../../../../src/domain/errors/generic-http-error-definitions";
import { CreateEventRequestModel } from "../../../../../src/domain/models/createEventRequest";
import { EventModel } from "../../../../../src/domain/models/event";
import { FollowModel } from "../../../../../src/domain/models/follow";
import { ITransactionController } from "../../../../../src/domain/interfaces/transactionController";

class MockEventRepository implements IEventRepository {
    chainEvent(eventId: string, userId: string, txSession?: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getTransactionController(): ITransactionController {
        throw new Error("Method not implemented.");
    }
    addUserToEventAndRepostIt(eventId: string, userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    checkEventExists(eventId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    createEvent(createEventReq: CreateEventRequestModel): Promise<EventModel> {
        throw new Error("Method not implemented.");
    }
    deleteEvent(eventId: string): Promise<void | null> {
        throw new Error("Method not implemented.");
    }
    findEventById(eventId: string): Promise<EventModel | null> {
        throw new Error("Method not implemented.");
    }
    findEventsCreatedByUser(userId: string): Promise<EventModel[]> {
        throw new Error("Method not implemented.");
    }
    findEventsJoinedByUser(userId: string): Promise<EventModel[]> {
        throw new Error("Method not implemented.");
    }
    findAllEventsForUser(userId: string): Promise<EventModel[]> {
        throw new Error("Method not implemented.");
    }
    addUserToEvent(eventId: string, userId: string): Promise<void | null> {
        throw new Error("Method not implemented.");
    }
    checkUserOwnsEvent(eventId: string, userId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    checkUserHasJoinedEvent(eventId: string, userId: string): Promise<boolean> {
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

describe("Add User To Event Service Tests", () => {
    const eventRepository = new MockEventRepository();
    const followRepository = new MockFollowRepository();
    const transactionController = new MockTransactionController();

    const addUsertoEventUseCase = new AddUserToEventServiceImpl(eventRepository, followRepository);
    const eventId = "123";
    const userId = "123";

    const eventResponse: EventModel = {
        "_id":"1213",
        "createdBy": {
            "_id": "123",
            "name": "user1",
            "email": "user1@gmail.com"
        },
        "joinedBy": [],
        "name": "Drink's with Ab",
        "description": "Event",
        "startTime": new Date("2022-11-30T22:34:00Z"),
        "endTime": new Date("2022-11-30T23:34:00Z"),
        "chainable": true,
        "chainCount": 0,
        "parentEvent": {
            "_id":"12134",
            "createdBy": {
                "_id": "123",
                "name": "user1",
                "email": "user1@gmail.com"
            },
            "joinedBy": [],
            "name": "Drink's with Ab",
            "description": "Event",
            "startTime": new Date("2022-11-30T22:34:00Z"),
            "endTime": new Date("2022-11-30T23:34:00Z"),
            "chainable": true,
            "chainCount": 0,
        },
        "event_location": {
            "name": "Bondi Hardware",
            "lat": -33.88959,
            "lon": 151.27301
        }
    };

    const eventResponseNotChainable: EventModel = {
        "_id":"1213",
        "createdBy": {
            "_id": "123",
            "name": "user1",
            "email": "user1@gmail.com"
        },
        "joinedBy": [],
        "name": "Drink's with Ab",
        "description": "Event",
        "startTime": new Date("2022-11-30T22:34:00Z"),
        "endTime": new Date("2022-11-30T23:34:00Z"),
        "chainable": false,
        "chainCount": 0,
        "event_location": {
            "name": "Bondi Hardware",
            "lat": -33.88959,
            "lon": 151.27301
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("Given that the event exists", () => {

        describe("Given that the user is a follower", () => {

            describe("Given that a valid request is sent for a chainable event", () => {

                describe("Given that the event has a parent", () => {

                    it("Should call the addUserToEventAndRepostIt method 1 time using the parent event Id", async () => {
                        jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
                        jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(eventResponse));
                        jest.spyOn(eventRepository, "addUserToEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve());
                        jest.spyOn(eventRepository, "chainEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve());
                        jest.spyOn(eventRepository, "checkUserHasJoinedEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(false));
                        jest.spyOn(eventRepository, "getTransactionController").mockImplementation(() => transactionController);
        
                        try{
                            await addUsertoEventUseCase.execute("123", "1234");
                        }
                        catch(error){
                            expect(error).toBeInstanceOf(ApplicationBaseError);
                            expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                        }
                        expect(eventRepository.chainEvent).toBeCalledTimes(1);
                        // IF you look at the eventResponse object you will see that it has a parent object with ID 12134.
                        // Since this is a chainable event with a parent object I want to add the users to the parne tevent.
                        expect(eventRepository.chainEvent).toBeCalledWith("12134", "1234", undefined);
                    });
                });

                it("Should call both addUserToEvent and chainEvent methods 1 time", async () => {
                    jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
                    jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(eventResponse));
                    jest.spyOn(eventRepository, "addUserToEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve());
                    jest.spyOn(eventRepository, "chainEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve());
                    jest.spyOn(eventRepository, "checkUserHasJoinedEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(false));
                    jest.spyOn(eventRepository, "getTransactionController").mockImplementation(() => transactionController);
    
                    try{
                        await addUsertoEventUseCase.execute("123", "1234");
                    }
                    catch(error){
                        expect(error).toBeInstanceOf(ApplicationBaseError);
                        expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                    }
                    expect(eventRepository.addUserToEvent).toBeCalledTimes(1);
                    expect(eventRepository.chainEvent).toBeCalledTimes(1);
                });
            });
    
            describe("Given that a valid request is sent for a non-chainable event", () => {
                it("Should call the addUserToEvent method 1 time", async () => {
                    jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
                    jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(eventResponseNotChainable));
                    jest.spyOn(eventRepository, "addUserToEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve());
                    jest.spyOn(eventRepository, "chainEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve());
                    jest.spyOn(eventRepository, "checkUserHasJoinedEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(false));
    
                    try{
                        await addUsertoEventUseCase.execute("123", "1234");
                    }
                    catch(error){
                        expect(error).toBeInstanceOf(ApplicationBaseError);
                        expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                    }
                    expect(eventRepository.addUserToEvent).toBeCalledTimes(1);
                    expect(eventRepository.chainEvent).toBeCalledTimes(0);
                });
            });

        });

        describe("Given that a user is not a follower", () => {
            it("Should throw a GenericHTTPErrorDefinitions.FORBIDDEN Error and call find all events 0 times", async () => {
                jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(false));
                jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(eventResponse));
                jest.spyOn(eventRepository, "addUserToEvent")
                jest.spyOn(eventRepository, "chainEvent")
                expect.assertions(3);

                try{
                    await addUsertoEventUseCase.execute("123", "1234");
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                }
                expect(followRepository.checkIfUserIsFollowedByFollower).toBeCalledTimes(1);
            });

            it("Should call the addUSer methods 0 times", async () => {
                jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(false));
                jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(eventResponse));
                jest.spyOn(eventRepository, "addUserToEvent")
                jest.spyOn(eventRepository, "chainEvent")

                try{
                    await addUsertoEventUseCase.execute("123", "1234");
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                }
                expect(eventRepository.addUserToEvent).toBeCalledTimes(0);
                expect(eventRepository.chainEvent).toBeCalledTimes(0);
            });
        });

        describe("Given that a user is trying to join an event that they have already joined", () => {
            it("Should throw a EventErrorDefinitions.INVALID_JOIN_REQUEST Exception", async () => {
                jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
                jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(eventResponse));
                jest.spyOn(eventRepository, "checkUserHasJoinedEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(true));
                expect.assertions(2);
                try {
                    await addUsertoEventUseCase.execute("123", "123");
                }catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", EventErrorDefinitions.INVALID_JOIN_REQUEST.code);
                }
            });
        });
    });

    describe("Given that the event does not exist", () => {
        it("Should throw a GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND Exception", async () => {
            jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(false));
            jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(null));
            expect.assertions(2);
            try {
                await addUsertoEventUseCase.execute("123", "123");
            }catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND.code);
            }
        });
    });
});