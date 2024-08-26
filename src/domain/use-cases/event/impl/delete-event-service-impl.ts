import { ApplicationBaseError } from "../../../errors/application-base-error";
import { GenericHTTPErrorDefinitions } from "../../../errors/generic-http-error-definitions";
import { IEventRepository } from "../../../repositories/interfaces/event-repository";
import { IDeleteEventService } from "../interfaces/delete-event-service";

export class DeleteEventServiceImpl implements IDeleteEventService {
    constructor(
        private readonly eventRepository: IEventRepository
    ) {
    }

    async execute(eventId: string, userId: string): Promise<void> {
        const eventExits = await this.eventRepository.checkEventExists(eventId);
        if(eventExits){
            const userOwnsEvent = await this.eventRepository.checkUserOwnsEvent(eventId, userId);
            if(!userOwnsEvent){
                throw new ApplicationBaseError(GenericHTTPErrorDefinitions.FORBIDDEN);
            }
            await this.eventRepository.deleteEvent(eventId);
        }
    }
}