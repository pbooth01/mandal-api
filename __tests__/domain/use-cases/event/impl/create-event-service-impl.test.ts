import { IEventRepository } from "../../../../../src/domain/repositories/interfaces/event-repository";
import { CreateEventServiceImpl } from "../../../../../src/domain/use-cases/event/impl/create-event-service-impl";
import { ApplicationBaseError } from "../../../../../src/domain/errors/application-base-error";
import { EventErrorDefinitions } from "../../../../../src/domain/errors/event-error-definitions";
import { CreateEventRequestModel } from "../../../../../src/domain/models/createEventRequest";
import { EventModel } from "../../../../../src/domain/models/event";
import { ITransactionController } from "../../../../../src/domain/interfaces/transactionController";

class MockEventRepository implements IEventRepository {
    chainEvent(eventId: string, userId: string, txSession?: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getTransactionController(): ITransactionController {
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
    addUserToEventAndRepostIt(eventId: string, userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    checkUserOwnsEvent(eventId: string, userId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    checkUserHasJoinedEvent(eventId: string, userId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}

describe("Create Event Service Tests", () => {
    const eventRepository = new MockEventRepository();
    const createEventUseCase = new CreateEventServiceImpl(eventRepository);

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("Given that an event request is sent with an end date before start date", () => {

        let currentStartDate = new Date();
        let currentEndDate = new Date();
        currentStartDate.setDate(currentStartDate.getDate() + 10);
        currentEndDate.setDate(currentEndDate.getDate() + 9);

        const createEventObject: CreateEventRequestModel = {
            "createdBy": "123",
            "name": "Drink's with Ab",
            "description": "Event",
            "startTime": currentStartDate,
            "endTime": currentEndDate,
            "chainable": true,
            "event_location": {
                "name": "Bondi Hardware",
                "lat": -33.88959,
                "lon": 151.27301
            }
        };

        const createEventResponse: EventModel = {
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


        it("Should throw an EventErrorDefinitions.INVALID_EVENT_LENGTH exception", async () => {
            jest.spyOn(eventRepository, "createEvent").mockImplementation((event: CreateEventRequestModel) => Promise.resolve(createEventResponse));
            expect.assertions(2);

            try {
                await createEventUseCase.execute(createEventObject);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", EventErrorDefinitions.INVALID_EVENT_LENGTH.code);
            }
        });

        it("Should call create event 0 times", async () => {
            jest.spyOn(eventRepository, "createEvent").mockImplementation((event: CreateEventRequestModel) => Promise.resolve(createEventResponse));

            try {
                await createEventUseCase.execute(createEventObject);
            }
            catch(error){
            }
            expect(eventRepository.createEvent).toBeCalledTimes(0);
        });  
    });

    describe("Given that an event request is sent with a start date or endDate that comes before the current date", () => {

        const createEventObject: CreateEventRequestModel = {
            "createdBy": "123",
            "name": "Drink's with Ab",
            "description": "Event",
            "startTime": new Date("2022-11-30T22:34:00Z"),
            "endTime": new Date("2022-11-29T23:34:00Z"),
            "chainable": true,
            "event_location": {
                "name": "Bondi Hardware",
                "lat": -33.88959,
                "lon": 151.27301
            }
        };

        const createEventResponse: EventModel = {
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


        it("Should throw an EventErrorDefinitions.INVALID_EVENT_DATE exception", async () => {
            jest.spyOn(eventRepository, "createEvent").mockImplementation((event: CreateEventRequestModel) => Promise.resolve(createEventResponse));
            expect.assertions(2);

            try {
                await createEventUseCase.execute(createEventObject);
            }
            catch(error){
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("code", EventErrorDefinitions.INVALID_EVENT_DATE.code);
            }
        });

        it("Should call create event 0 times", async () => {
            jest.spyOn(eventRepository, "createEvent").mockImplementation((event: CreateEventRequestModel) => Promise.resolve(createEventResponse));

            try {
                await createEventUseCase.execute(createEventObject);
            }
            catch(error){
            }
            expect(eventRepository.createEvent).toBeCalledTimes(0);
        });  
    }); 

    describe("Given that a valid event request is sent", () => {

        let currentStartDate = new Date();
        let currentEndDate = new Date();
        currentStartDate.setDate(currentStartDate.getDate() + 10);
        currentEndDate.setDate(currentEndDate.getDate() + 11);

        const createEventObject: CreateEventRequestModel = {
            "createdBy": "123",
            "name": "Drink's with Ab",
            "description": "Event",
            "startTime": currentStartDate,
            "endTime": currentEndDate,
            "chainable": true,
            "event_location": {
                "name": "Bondi Hardware",
                "lat": -33.88959,
                "lon": 151.27301
            }
        };

        const createEventResponse: EventModel = {
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


        it("Should not throw an exception", async () => {
            jest.spyOn(eventRepository, "createEvent").mockImplementation((event: CreateEventRequestModel) => Promise.resolve(createEventResponse));

            expect(async () => {
                await createEventUseCase.execute(createEventObject);
            }).not.toThrow();
        });

        it("Should call create event 1 time", async () => {
            jest.spyOn(eventRepository, "createEvent").mockImplementation((event: CreateEventRequestModel) => Promise.resolve(createEventResponse));

            try {
                await createEventUseCase.execute(createEventObject);
            }
            catch(error){
            }
            expect(eventRepository.createEvent).toBeCalledTimes(1);
        });  
    });
});