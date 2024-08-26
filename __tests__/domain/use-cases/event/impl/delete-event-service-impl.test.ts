import { IEventRepository } from "../../../../../src/domain/repositories/interfaces/event-repository";
import { DeleteEventServiceImpl } from "../../../../../src/domain/use-cases/event/impl/delete-event-service-impl";
import { ApplicationBaseError } from "../../../../../src/domain/errors/application-base-error";
import { GenericHTTPErrorDefinitions } from "../../../../../src/domain/errors/generic-http-error-definitions";
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

describe("Delete Event Service Tests", () => {
    const eventRepository = new MockEventRepository();
    const deleteEventUseCase = new DeleteEventServiceImpl(eventRepository);
    const eventId = "123";
    const userId = "123";

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("Given that an event exists", () => {
        describe("Given that a user does own an event", () => {
            it("Should not throw an error", async () => {
                jest.spyOn(eventRepository, "checkEventExists").mockImplementation((eventId: string) => Promise.resolve(true));
                jest.spyOn(eventRepository, "checkUserOwnsEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(true));
                jest.spyOn(eventRepository, "deleteEvent").mockImplementation((eventId: string) => Promise.resolve());
    
                expect(async () => {
                    await deleteEventUseCase.execute(eventId, userId);
                }).not.toThrow()
            });
    
            it("Should call delete event 1 time", async () => {
                jest.spyOn(eventRepository, "checkEventExists").mockImplementation((eventId: string) => Promise.resolve(true));
                jest.spyOn(eventRepository, "checkUserOwnsEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(true));
                jest.spyOn(eventRepository, "deleteEvent").mockImplementation((eventId: string) => Promise.resolve());
    
                try {
                    await deleteEventUseCase.execute(eventId, userId);
                }
                catch(error){
                }
                expect(eventRepository.deleteEvent).toBeCalledTimes(1);
                expect(eventRepository.deleteEvent).toBeCalledWith(eventId);
            });
        }); 
    
        describe("Given that a user does not own an event", () => {
            it("Should throw an Error GenericHTTPErrorDefinitions.FORBIDDEN", async () => {
                jest.spyOn(eventRepository, "checkEventExists").mockImplementation((eventId: string) => Promise.resolve(true));
                jest.spyOn(eventRepository, "checkUserOwnsEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(false));
                jest.spyOn(eventRepository, "deleteEvent").mockImplementation((eventId: string) => Promise.resolve());
                expect.assertions(2);
    
                try {
                    await deleteEventUseCase.execute(eventId, userId);
                }
                catch(error){
                    expect(error).toBeInstanceOf(ApplicationBaseError);
                    expect(error).toHaveProperty("code", GenericHTTPErrorDefinitions.FORBIDDEN.code);
                }
            });
    
            it("Should throw an Error GenericHTTPErrorDefinitions.FORBIDDEN", async () => {
                jest.spyOn(eventRepository, "checkEventExists").mockImplementation((eventId: string) => Promise.resolve(true));
                jest.spyOn(eventRepository, "checkUserOwnsEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(false));
                jest.spyOn(eventRepository, "deleteEvent").mockImplementation((eventId: string) => Promise.resolve());
    
                try {
                    await deleteEventUseCase.execute(eventId, userId);
                }
                catch(error){
                }
                expect(eventRepository.deleteEvent).toBeCalledTimes(0);
            });
        });  
    });

    describe("Given that an event does not exsit", () => {
        it("checkUserOwnsEvent and deleteEvent should not be called", async () => {
            jest.spyOn(eventRepository, "checkEventExists").mockImplementation((eventId: string) => Promise.resolve(false));
            jest.spyOn(eventRepository, "checkUserOwnsEvent").mockImplementation((eventId: string, userId: string) => Promise.resolve(true));
            jest.spyOn(eventRepository, "deleteEvent").mockImplementation((eventId: string) => Promise.resolve());

            await deleteEventUseCase.execute(eventId, userId);

            expect(eventRepository.checkUserOwnsEvent).toBeCalledTimes(0);
            expect(eventRepository.deleteEvent).toBeCalledTimes(0);
        });
    }); 
});