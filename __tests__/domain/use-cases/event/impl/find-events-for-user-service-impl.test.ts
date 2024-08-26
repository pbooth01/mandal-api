import { IEventRepository } from "../../../../../src/domain/repositories/interfaces/event-repository";
import { IFollowRepository } from "../../../../../src/domain/repositories/interfaces/follow-repository";
import { FindEventsForUserServiceImpl } from "../../../../../src/domain/use-cases/event/impl/find-events-for-user-service-impl";
import { ApplicationBaseError } from "../../../../../src/domain/errors/application-base-error";
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

describe("Find Events For User Service Tests", () => {
    const eventRepository = new MockEventRepository();
    const followRepository = new MockFollowRepository();

    const findEventsForUserUseCase = new FindEventsForUserServiceImpl(eventRepository, followRepository);
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
        "event_location": {
            "name": "Bondi Hardware",
            "lat": -33.88959,
            "lon": 151.27301
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("Given that a user is searching for their own events", () => {
        it("Should not check to see if a user is a follower", async () => {
            jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(false));
            jest.spyOn(eventRepository, "findEventsCreatedByUser").mockImplementation((userId: string) => Promise.resolve([]));
            jest.spyOn(eventRepository, "findEventsJoinedByUser").mockImplementation((userId: string) => Promise.resolve([]));
            jest.spyOn(eventRepository, "findAllEventsForUser").mockImplementation((userId: string) => Promise.resolve([]));

            const events = await findEventsForUserUseCase.execute("123", "123", "all");

            expect(events).toStrictEqual([]);
            expect(followRepository.checkIfUserIsFollowedByFollower).toBeCalledTimes(0);
        });
    });

    describe("Given that a user is searching for another users events", () => {
        describe("Given that a user is a follower", () => {
            it("Should not check to see if a user is a follower", async () => {
                jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
                jest.spyOn(eventRepository, "findAllEventsForUser").mockImplementation((userId: string) => Promise.resolve([]));
    
                const events = await findEventsForUserUseCase.execute("1234", "123", "all");
    
                expect(events).toStrictEqual([]);
                expect(followRepository.checkIfUserIsFollowedByFollower).toBeCalledTimes(1);
            });

            describe("Given that a user has sent a filter property of 'all'", () => {
                it("Should call findAllEventsForUser 1 time", async () => {
                    jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
                    jest.spyOn(eventRepository, "findEventsCreatedByUser").mockImplementation((userId: string) => Promise.resolve([]));
                    jest.spyOn(eventRepository, "findEventsJoinedByUser").mockImplementation((userId: string) => Promise.resolve([]));
                    jest.spyOn(eventRepository, "findAllEventsForUser").mockImplementation((userId: string) => Promise.resolve([]));
    
                    const events = await findEventsForUserUseCase.execute("1234", "123", "all");

                    expect(eventRepository.findEventsCreatedByUser).toBeCalledTimes(0);
                    expect(eventRepository.findEventsJoinedByUser).toBeCalledTimes(0);
                    expect(eventRepository.findAllEventsForUser).toBeCalledTimes(1);
                });
            });

            describe("Given that a user has sent a filter property of 'joined'", () => {
                it("Should call findEventsJoinedByUser 1 time", async () => {
                    jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
                    jest.spyOn(eventRepository, "findEventsCreatedByUser").mockImplementation((userId: string) => Promise.resolve([]));
                    jest.spyOn(eventRepository, "findEventsJoinedByUser").mockImplementation((userId: string) => Promise.resolve([]));
                    jest.spyOn(eventRepository, "findAllEventsForUser").mockImplementation((userId: string) => Promise.resolve([]));
    
                    const events = await findEventsForUserUseCase.execute("1234", "123", "joined");

                    expect(eventRepository.findEventsCreatedByUser).toBeCalledTimes(0);
                    expect(eventRepository.findEventsJoinedByUser).toBeCalledTimes(1);
                    expect(eventRepository.findAllEventsForUser).toBeCalledTimes(0);
                });
            });

            describe("Given that a user has sent a filter property of 'created'", () => {
                it("Should call findEventsCreatedByUser 1 time", async () => {
                    jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
                    jest.spyOn(eventRepository, "findEventsCreatedByUser").mockImplementation((userId: string) => Promise.resolve([]));
                    jest.spyOn(eventRepository, "findEventsJoinedByUser").mockImplementation((userId: string) => Promise.resolve([]));
                    jest.spyOn(eventRepository, "findAllEventsForUser").mockImplementation((userId: string) => Promise.resolve([]));
    
                    const events = await findEventsForUserUseCase.execute("1234", "123", "created");

                    expect(eventRepository.findEventsCreatedByUser).toBeCalledTimes(1);
                    expect(eventRepository.findEventsJoinedByUser).toBeCalledTimes(0);
                    expect(eventRepository.findAllEventsForUser).toBeCalledTimes(0);
                });
            });
        });

        describe("Given that a user is not a follower", () => {
            it("Should throw a GenericHTTPErrorDefinitions.FORBIDDEN Error and call find all events 0 times", async () => {
                jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(false));
                jest.spyOn(eventRepository, "findEventsCreatedByUser").mockImplementation((userId: string) => Promise.resolve([]));
                jest.spyOn(eventRepository, "findEventsJoinedByUser").mockImplementation((userId: string) => Promise.resolve([]));
                jest.spyOn(eventRepository, "findAllEventsForUser").mockImplementation((userId: string) => Promise.resolve([]));
                expect.assertions(6);

                try{
                    const events = await findEventsForUserUseCase.execute("1234", "123", "all");
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                }
                expect(followRepository.checkIfUserIsFollowedByFollower).toBeCalledTimes(1);
                expect(eventRepository.findEventsCreatedByUser).toBeCalledTimes(0);
                expect(eventRepository.findEventsJoinedByUser).toBeCalledTimes(0);
                expect(eventRepository.findAllEventsForUser).toBeCalledTimes(0);
            });
        });
    });
});