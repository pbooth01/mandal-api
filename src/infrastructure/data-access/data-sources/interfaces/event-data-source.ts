import { CreateEventRequestModel } from "../../../../domain/models/createEventRequest";
import { EventModel } from "../../../../domain/models/event";
import { ITransactionDataSource } from "./transaction-data-source";

export interface IEventDataSource extends ITransactionDataSource {
    create(userData: CreateEventRequestModel, txSession: any): Promise<EventModel>;
    deleteEvent(eventId: string, txSession: any): Promise<void | null>;
    findEventById(eventId: string, txSession: any): Promise<EventModel | null>;
    findOneEventByIdAndCreatedByUser(eventId: string, userId: string, txSession: any): Promise<EventModel | null>;
    findOneEventByIdAndJoinedByUser(eventId: string, userId: string, txSession: any): Promise<EventModel | null>;
    findEventsCreatedByUser(userId: string, txSession: any): Promise<EventModel[]>;
    findEventsJoinedByUser(userId: string, txSession: any): Promise<EventModel[]>;
    findAllEventsForUser(userId: string, txSession: any): Promise<EventModel[]>;
    addUserToEvent(eventId: string, userId: string, txSession: any): Promise<void | null>;
    chainEvent(eventId: string, userId: string, txSession: any): Promise<void>;
}