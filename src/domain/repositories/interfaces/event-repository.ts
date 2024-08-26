import { CreateEventRequestModel } from "../../models/createEventRequest";
import { EventModel } from "../../models/event";
import { ITransactionRepository } from "./transaction-repository";

export interface IEventRepository extends ITransactionRepository {
    createEvent(createEventReq: CreateEventRequestModel, txSession?: any): Promise<EventModel>;
    deleteEvent(eventId: string, txSession?: any): Promise<void | null>;
    findEventById(eventId: string, txSession?: any): Promise<EventModel | null>;
    findEventsCreatedByUser(userId: string, txSession?: any): Promise<EventModel[]>;
    findEventsJoinedByUser(userId: string, txSession?: any): Promise<EventModel[]>;
    findAllEventsForUser(userId: string, txSession?: any): Promise<EventModel[]>;
    addUserToEvent(eventId: string, userId: string, txSession?: any): Promise<void | null>;
    chainEvent(eventId: string, userId: string, txSession?: any): Promise<void>;
    checkUserOwnsEvent(eventId: string, userId: string, txSession?: any): Promise<boolean>;
    checkUserHasJoinedEvent(eventId: string, userId: string, txSession?: any): Promise<boolean>;
    checkEventExists(eventId: string, txSession?: any): Promise<boolean>;
}