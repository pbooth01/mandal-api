import { ApplicationBaseError } from "../../../errors/application-base-error";
import { EventErrorDefinitions } from "../../../errors/event-error-definitions";
import { CreateEventRequestModel } from "../../../models/createEventRequest";
import { EventModel } from "../../../models/event";
import { IEventRepository } from "../../../repositories/interfaces/event-repository";
import { ICreateEventService } from "../interfaces/create-event-service";

export class CreateEventServiceImpl implements ICreateEventService {
    constructor(
        private readonly eventRepository: IEventRepository
    ) {
    }

    async execute(event: CreateEventRequestModel): Promise<EventModel> {
        const currentDate: Date = new Date();
        if(event.startTime < currentDate || event.endTime < currentDate){
            throw new ApplicationBaseError(EventErrorDefinitions.INVALID_EVENT_DATE);
        }
        if(event.endTime && (event.endTime <= event.startTime)){
            throw new ApplicationBaseError(EventErrorDefinitions.INVALID_EVENT_LENGTH);
        }
        return await this.eventRepository.createEvent(event);
    }
}