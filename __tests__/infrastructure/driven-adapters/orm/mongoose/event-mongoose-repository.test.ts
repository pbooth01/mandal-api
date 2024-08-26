import { Model } from "mongoose";
import { CreateEventRequestModel } from "../../../../../src/domain/models/createEventRequest";
import { EventModel } from "../../../../../src/domain/models/event";
import { MongoDBEventDataSource } from "../../../../../src/infrastructure/data-access/data-sources/impl/mongodb/mongodb-event-data-source-impl";
import { EventMongooseRepository } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/event-mongoose-repository";
import { MongoTestDBController } from "../../../../../src/tests/mongoose-test-db-controller";
import { MongoDBConnection } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/impl/mongodb-connector";
import { UserModel } from "../../../../../src/domain/models/user";

describe("Event Mongoose Repository Tests", () => {
    const mongooseTestDbController: MongoTestDBController = new MongoTestDBController(MongoDBConnection);

    // I am using this method because I want to make sure that the DB is setup properly before I do any object instantiation
    function getStaticTestRequirements(){
        const eventRepository: EventMongooseRepository = new EventMongooseRepository(new MongoDBEventDataSource(MongoDBConnection));
        const UserModelSchema: Model<UserModel> = MongoDBConnection.getModel<UserModel>('User');
        const EventModelSchema: Model<EventModel> = MongoDBConnection.getModel<EventModel>('Event');

        return {
            eventRepository: eventRepository,
            UserModelSchema: UserModelSchema,
            EventModelSchema: EventModelSchema
        }
    }

    beforeAll( async () => {
        await mongooseTestDbController.connectDB();
    });

    afterAll( async () => {
        await mongooseTestDbController.dropDB();
    })

    afterEach( async () => {
        await mongooseTestDbController.dropCollections();
    })

    describe("Given a valid create event request", () => {

        it("Create Event Should Save a new Event in the database with matching properties to the request", async () => {

            const {eventRepository, UserModelSchema} = getStaticTestRequirements();

            const newUser = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser._id);
        });
    });

    describe("Given a valid existing event Id", () => {

        it("FindEventByID should find the event in the database", async () => {

            const {eventRepository, UserModelSchema} = getStaticTestRequirements();

            const newUser = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser._id);

            const foundEvent = await eventRepository.findEventById(newEvent._id);

            expect(foundEvent).not.toBe(null);
            expect(foundEvent?._id).toStrictEqual(newEvent._id);
            expect(foundEvent?.createdBy._id).toStrictEqual(newEvent.createdBy._id);

        });

        it("checkUserOwnsEvent should return true", async () => {

            const {eventRepository, UserModelSchema} = getStaticTestRequirements();

            const newUser = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser._id);

            const newUserOwnsEvent = await eventRepository.checkUserOwnsEvent(newEvent._id, newUser._id);
            expect(newUserOwnsEvent).toBe(true);
        });

        it("FindEventsCreatedByUser should find the event in the database for the user that created it", async () => {

            const {eventRepository, UserModelSchema} = getStaticTestRequirements();

            const newUser = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser._id);

            const foundEvents: EventModel[] = await eventRepository.findEventsCreatedByUser(newUser._id);

            expect(foundEvents.length).toBe(1);
            expect(foundEvents[0]?._id).toStrictEqual(newEvent._id)

        });

        it("FindEventsCreatedByUser should not find an event in the database for a user that has no events", async () => {

            const {eventRepository, UserModelSchema} = getStaticTestRequirements();

            const newUser1 = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser1._id).toBeDefined();

            const newUser2 = await UserModelSchema.create({
                name: "user1",
                email: "user2@gmail.com"
            })
            expect(newUser2._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser1._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser1._id);

            const foundEvents: EventModel[] = await eventRepository.findEventsCreatedByUser(newUser2._id);

            expect(foundEvents.length).toBe(0);

        });

        it("Delete Event should remove the event from the database", async () => {

            const {eventRepository, UserModelSchema, EventModelSchema} = getStaticTestRequirements();

            const newUser = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser._id);

            const deleteEvent = await eventRepository.deleteEvent(newEvent._id);

            expect(await EventModelSchema.findById(newEvent._id)).toBe(null)

        });

        it("addUserToEventAndRepostIt should create a new event in the database", async () => {

            const {eventRepository, UserModelSchema, EventModelSchema} = getStaticTestRequirements();

            expect((await EventModelSchema.find()).length).toBe(0);

            const newUser1 = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser1._id).toBeDefined();

            const newUser2 = await UserModelSchema.create({
                name: "user2",
                email: "user2@gmail.com"
            })
            expect(newUser2._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser1._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser1._id);

            await eventRepository.chainEvent(newEvent._id, newUser2._id);

            expect((await EventModelSchema.find()).length).toBe(2)
        });

        it("addUserToEventAndRepostIt should create a new event in the database with all the same core properties as its parent event", async () => {

            const {eventRepository, UserModelSchema, EventModelSchema} = getStaticTestRequirements();

            const newUser1 = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser1._id).toBeDefined();

            const newUser2 = await UserModelSchema.create({
                name: "user2",
                email: "user2@gmail.com"
            })
            expect(newUser2._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser1._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser1._id);

            await eventRepository.chainEvent(newEvent._id, newUser2._id);

            const repostEvent: EventModel | null = await EventModelSchema.findOne({createdBy: newUser2._id});
            // Verifyign that 
            expect(repostEvent?.createdBy._id).toStrictEqual(newUser2._id);
            expect(repostEvent?.chainCount).toBe(0);
            expect(repostEvent?.parentEvent).toStrictEqual(newEvent._id);

            expect(repostEvent?.name).toBe(newEvent.name);
            expect(repostEvent?.description).toBe(newEvent.description);
            expect(repostEvent?.startTime).toStrictEqual(newEvent.startTime);
            expect(repostEvent?.endTime).toStrictEqual(newEvent.endTime);
            expect(repostEvent?.event_location).toStrictEqual(newEvent.event_location);
        });

        it("addUserToEventAndRepostIt should create a new event in the database with new values for properties for createdBy, joinedBy, and set chainCount to 0", async () => {

            const {eventRepository, UserModelSchema, EventModelSchema} = getStaticTestRequirements();

            const newUser1 = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser1._id).toBeDefined();

            const newUser2 = await UserModelSchema.create({
                name: "user2",
                email: "user2@gmail.com"
            })
            expect(newUser2._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser1._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser1._id);

            await eventRepository.chainEvent(newEvent._id, newUser2._id);

            const repostEvent: EventModel | null = await EventModelSchema.findOne({createdBy: newUser2._id});

            expect(repostEvent?.name).toBe(newEvent.name);
            expect(repostEvent?.description).toBe(newEvent.description);
            expect(repostEvent?.startTime).toStrictEqual(newEvent.startTime);
            expect(repostEvent?.endTime).toStrictEqual(newEvent.endTime);
            expect(repostEvent?.event_location).toStrictEqual(newEvent.event_location);
        });
    });

    describe("Given a valid existing event Id with one joined user", () => {
        it("Check USer has joined Event should return true", async () => {

            const {eventRepository, UserModelSchema, EventModelSchema} = getStaticTestRequirements();

            const newUser1 = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser1._id).toBeDefined();

            const newUser2 = await UserModelSchema.create({
                name: "user1",
                email: "user2@gmail.com"
            })
            expect(newUser2._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser1._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser1._id);

            const createEventObject2: CreateEventRequestModel = {
                "createdBy": newUser1._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent2 = await eventRepository.createEvent(createEventObject);
            expect(newEvent2._id).toBeDefined();
            expect(newEvent2.createdBy._id).toBe(newUser1._id);

            await EventModelSchema.findByIdAndUpdate(newEvent._id, {
                $push: {
                    joinedBy: newUser2._id
                }
            });

            const foundEvents: EventModel[] = await eventRepository.findEventsJoinedByUser(newUser2._id);
            expect(foundEvents.length).toBe(1);
            expect(foundEvents[0]._id).toStrictEqual(newEvent._id);
        });

        it("FindEventsJoinedByUser should find an event in the database that this user has joined", async () => {

            const {eventRepository, UserModelSchema, EventModelSchema} = getStaticTestRequirements();

            const newUser1 = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser1._id).toBeDefined();

            const newUser2 = await UserModelSchema.create({
                name: "user1",
                email: "user2@gmail.com"
            })
            expect(newUser2._id).toBeDefined();

            const newUser3 = await UserModelSchema.create({
                name: "user3",
                email: "user3@gmail.com"
            })
            expect(newUser3._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser1._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser1._id);

            await EventModelSchema.findByIdAndUpdate(newEvent._id, {
                $push: {
                    joinedBy: newUser2._id
                }
            });

            const user1HasJoined = await eventRepository.checkUserHasJoinedEvent(newEvent._id, newUser1._id);
            expect(user1HasJoined).toBe(true);

            const user2HasJoined = await eventRepository.checkUserHasJoinedEvent(newEvent._id, newUser2._id);
            expect(user2HasJoined).toBe(true);

            const user3HasJoined = await eventRepository.checkUserHasJoinedEvent(newEvent._id, newUser3._id);
            expect(user3HasJoined).toBe(false);

            
        });
    });

    describe("Given a valid existing event Id without any joined user", () => {

        it("FindEventsJoinedByUser should return null", async () => {
            
            const {eventRepository, UserModelSchema} = getStaticTestRequirements();

            const newUser1 = await UserModelSchema.create({
                name: "user1",
                email: "user1@gmail.com"
            })
            expect(newUser1._id).toBeDefined();

            const newUser2 = await UserModelSchema.create({
                name: "user1",
                email: "user2@gmail.com"
            })
            expect(newUser2._id).toBeDefined();

            const createEventObject: CreateEventRequestModel = {
                "createdBy": newUser1._id,
                "name": "Drink's with Ab",
                "description": "Event",
                "startTime": new Date(),
                "endTime": new Date(),
                "chainable": true,
                "event_location": {
                    "name": "Bondi Hardware",
                    "lat": -33.88959,
                    "lon": 151.27301
                }
            };
            
            const newEvent = await eventRepository.createEvent(createEventObject);
            expect(newEvent._id).toBeDefined();
            expect(newEvent.createdBy._id).toBe(newUser1._id);

            const foundEvents: EventModel[] = await eventRepository.findEventsJoinedByUser(newUser2._id);
            expect(foundEvents.length).toBe(0);
        });
    });

    describe("Given an event id for a non-existent event", () => {
        it("findEvent by ID should return null", async () => {
            const {eventRepository} = getStaticTestRequirements();
            const foundEvent = await eventRepository.findEventById("51bb793aca2ab77a3200000d");
            expect(foundEvent).toBe(null);
        });
    });
    
})