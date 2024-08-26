import { IEventRepository } from "../../../../../domain/repositories/interfaces/event-repository";
import { EventModel } from "../../../../../domain/models/event";
import { IEventDataSource } from "../../../../data-access/data-sources/interfaces/event-data-source";
import { ITransactionController } from "../../mongoose-transaction-controller";

export class EventMongooseRepository implements IEventRepository {

    private dataSource: IEventDataSource
    constructor(dataSource: IEventDataSource) {
        this.dataSource = dataSource
    }
    
    getTransactionController(): ITransactionController {
        return this.dataSource.getTransactionController();
    }

    async createEvent(createEventReq: any, txSession = null): Promise<EventModel> {
        return await this.dataSource.create(createEventReq, txSession);
    }

    async deleteEvent(eventId: string, txSession = null): Promise<void | null> {
        return await this.dataSource.deleteEvent(eventId, txSession);
    }

    async findEventById(eventId: string, txSession = null): Promise<EventModel | null> {
        return await this.dataSource.findEventById(eventId, txSession);
    }

    async findEventsCreatedByUser(userId: string, txSession = null): Promise<EventModel[]> {
        return await this.dataSource.findEventsCreatedByUser(userId, txSession);
    }

    async findEventsJoinedByUser(userId: string, txSession = null): Promise<EventModel[]> {
        return await this.dataSource.findEventsJoinedByUser(userId, txSession);
    }

    async findAllEventsForUser(userId: string, txSession = null): Promise<EventModel[]> {
        return await this.dataSource.findAllEventsForUser(userId, txSession);
    }
    
    async addUserToEvent(eventId: string, userId: string, txSession = null): Promise<void | null> {
        return await this.dataSource.addUserToEvent(eventId, userId, txSession);
    }

    async chainEvent(eventId: string, userId: string, txSession = null): Promise<void> {
        return await this.dataSource.chainEvent(eventId, userId, txSession);
    }

    async checkUserOwnsEvent(eventId: string, userId: string, txSession = null): Promise<boolean> {
        return await this.dataSource.findOneEventByIdAndCreatedByUser(eventId, userId, txSession) !== null;
    }

    async checkUserHasJoinedEvent(eventId: string, userId: string, txSession = null): Promise<boolean> {
        return await this.dataSource.findOneEventByIdAndJoinedByUser(eventId, userId, txSession) !== null;;
    }

    async checkEventExists(eventId: string, txSession = null): Promise<boolean> {
        return await this.findEventById(eventId, txSession) !== null;
    }
}