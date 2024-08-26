import { IEventRepository } from "../../../../../src/domain/repositories/interfaces/event-repository";
import { IFollowRepository } from "../../../../../src/domain/repositories/interfaces/follow-repository";
import { FindEventServiceImpl } from "../../../../../src/domain/use-cases/event/impl/find-event-service-impl";
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

describe("Find Event Service Tests", () => {
    const eventRepository = new MockEventRepository();
    const followRepository = new MockFollowRepository();

    const findEventUseCase = new FindEventServiceImpl(eventRepository, followRepository);
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

    describe("Given that an event exists", () => {
        describe("Given that a user is a follower of the event createor", () => {
            it("Should not throw an error", async () => {
                jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(eventResponse));
                jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(true));
            
                expect(async () => {
                    await findEventUseCase.execute(eventId, userId);
                }).not.toThrow()
            });
        })
        describe("Given that a user is not a follower of the event createor", () => {
            it("Should throw an GenericHTTPErrorDefinitions.FORBIDDEN error", async () => {
                jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(eventResponse));
                jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(false));
                expect.assertions(2);

                try {
                    await findEventUseCase.execute(eventId, userId);
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                }
            });
        })
    });

    describe("Given that an event does not exsit", () => {
        it("Should throw an GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND error", async () => {
            jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(null));
            jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(false));
            expect.assertions(2);

            try {
                await findEventUseCase.execute(eventId, userId);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND.code);
            }
        });

        it("Should not call checkIfUserIsFollowedByFollower", async () => {
            jest.spyOn(eventRepository, "findEventById").mockImplementation((eventId: string) => Promise.resolve(null));
            jest.spyOn(followRepository, "checkIfUserIsFollowedByFollower").mockImplementation((userId: string, followerId: string) => Promise.resolve(false));
            expect.assertions(3);

            try {
                await findEventUseCase.execute(eventId, userId);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND.code);
            }
            expect(followRepository.checkIfUserIsFollowedByFollower).toBeCalledTimes(0);
        });
    }); 
});