import { Model } from "mongoose";
import { ApplicationBaseError } from "../../../../../domain/errors/application-base-error";
import { GenericHTTPErrorDefinitions } from "../../../../../domain/errors/generic-http-error-definitions";
import { CreateEventRequestModel } from "../../../../../domain/models/createEventRequest";
import { EventModel } from "../../../../../domain/models/event";
import { ITransactionController, MongooseTransactionController } from "../../../../driven-adapters/adapters/mongoose-transaction-controller";
import { IMongoDBConnector } from "../../../../driven-adapters/adapters/orm/mongoose/interfaces/mongodb-connector";
import { IEventDataSource } from "../../interfaces/event-data-source";


export class MongoDBEventDataSource implements IEventDataSource {

    private dbConnector: IMongoDBConnector
    private eventModel: Model<EventModel>;
    constructor(dbConnector: IMongoDBConnector) {
        this.dbConnector = dbConnector;
        this.eventModel = this.dbConnector.getModel<EventModel>('Event');
    }

    getTransactionController(): ITransactionController {
        return new MongooseTransactionController(this.dbConnector);
    }

    async create(eventData: CreateEventRequestModel, txSession: any = null): Promise<EventModel> {
        const[newEvent] = await this.eventModel.create([eventData], {session: txSession});
        return newEvent;
    } 

    async deleteEvent(eventId: string, txSession: any = null): Promise<void | null> {
        return await this.eventModel.findByIdAndDelete(eventId, {session: txSession});
    }

    async findEventById(eventId: string, txSession: any = null): Promise<EventModel | null> {
        return await this.eventModel.findById(eventId, {}, {session: txSession});
    }

    async findEventsCreatedByUser(ownerId: string, txSession: any = null): Promise<EventModel[]> {
        return await this.eventModel.find({
            createdBy: ownerId
        }, {}, {session: txSession});
    }

    async findEventsJoinedByUser(userId: string, txSession: any = null): Promise<EventModel[]> {
        return await this.eventModel.find({ 
            joinedBy : userId
        }, {}, {session: txSession});
    }

    async findAllEventsForUser(userId: string, txSession: any = null): Promise<EventModel[]> {
        return await this.eventModel.find({ 
            createdBy: userId,
            joinedBy : userId
        }, {}, {session: txSession});
    }

    async addUserToEvent(eventId: string, userId: string, txSession: any = null): Promise<void | null> {
        return await this.eventModel.findByIdAndUpdate(eventId, {
            $push: {
                joinedBy: userId
            }
        }, {session: txSession});
    }

    async chainEvent(eventId: string, userId: string, txSession: any = null): Promise<void> {
        let initialEvent = await this.eventModel.findById(eventId, {}, {session: txSession});

        if(initialEvent === null){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND);
        }

        // Look into keeping multiple versions of the EventModel Object. One populated and one depopulated.
        let chainedEventPojo: any = initialEvent.toObject({
            transform: (doc, ret, options) => {
                delete ret['_id'];
                delete ret['createdBy'];
                delete ret['chainCount'];
                delete ret['joinedBy'];
                return ret; 
            }
        });
        chainedEventPojo.createdBy = userId;
        chainedEventPojo.parentEvent = initialEvent._id;
        const repostDoc = new this.eventModel(chainedEventPojo);

        await repostDoc.save({session: txSession});
    }

    async findOneEventByIdAndCreatedByUser(eventId: string, userId: string, txSession: any = null): Promise<EventModel | null> {
        return await this.eventModel.findOne({ 
            _id: eventId,
            createdBy: userId
        }, {}, {session: txSession});
    }

    async findOneEventByIdAndJoinedByUser(eventId: string, userId: string, txSession: any = null): Promise<EventModel | null> {
        return await this.eventModel.findOne({ 
            _id: eventId,
            $or: [
                {joinedBy: userId},
                {createdBy: userId}
            ]
        }, {}, {session: txSession});
    }
}