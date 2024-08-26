import { ApplicationBaseError } from "../../../errors/application-base-error";
import { GenericHTTPErrorDefinitions } from "../../../errors/generic-http-error-definitions";
import { EventModel } from "../../../models/event";
import { IEventRepository } from "../../../repositories/interfaces/event-repository";
import { IFollowRepository } from "../../../repositories/interfaces/follow-repository";
import { IFindEventService } from "../interfaces/find-event-service";

export class FindEventServiceImpl implements IFindEventService {
    constructor(
        private readonly eventRepository: IEventRepository,
        private readonly followRepository: IFollowRepository
    ) {
    }

    async execute(eventId: string, userId: string): Promise<EventModel | null> {
        const event = await this.eventRepository.findEventById(eventId);
        if(event === null){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND);
        }
        const isFollower = await this.followRepository.checkIfUserIsFollowedByFollower(event.createdBy._id, userId);
        if(!isFollower){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.FORBIDDEN);
        }
        
        return event;
    }
}