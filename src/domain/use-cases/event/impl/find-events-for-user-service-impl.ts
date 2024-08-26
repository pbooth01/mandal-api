import { ApplicationBaseError } from "../../../errors/application-base-error";
import { EventErrorDefinitions } from "../../../errors/event-error-definitions";
import { GenericHTTPErrorDefinitions } from "../../../errors/generic-http-error-definitions";
import { EventModel } from "../../../models/event";
import { FindEventForUserFilter } from "../../../types/find-events-for-user-filter";
import { IEventRepository } from "../../../repositories/interfaces/event-repository";
import { IFollowRepository } from "../../../repositories/interfaces/follow-repository";
import { IFindEventsForUserService } from "../interfaces/find-events-for-user-service";

export class FindEventsForUserServiceImpl implements IFindEventsForUserService {
    constructor(
        private readonly eventRepository: IEventRepository,
        private readonly followRepository: IFollowRepository
    ) {
    }

    async findEventsForUser(eventsUserId: string, filterType: FindEventForUserFilter): Promise<EventModel[]> {
        let response: EventModel[] = [];

        switch(filterType) {
            case "created":
                response = await this.eventRepository.findEventsCreatedByUser(eventsUserId);
                break;
            case "joined":
                response = await this.eventRepository.findEventsJoinedByUser(eventsUserId);
                break;
            case "all":
                response = await this.eventRepository.findAllEventsForUser(eventsUserId);
                break;
            default:
                throw new ApplicationBaseError(EventErrorDefinitions.INVALID_EVENT_FILTER_PARAMETER)
          }
        
        return response;
    }

    async execute(sessionUserId: string, eventsUserId: string, filterType: FindEventForUserFilter): Promise<EventModel[]> {
        // If a user is looking up their own events then there is no need to check if they are a follower.
        if(sessionUserId !== eventsUserId){
            const isFollower = await this.followRepository.checkIfUserIsFollowedByFollower(eventsUserId, sessionUserId);
            if(!isFollower){
                throw new ApplicationBaseError(GenericHTTPErrorDefinitions.FORBIDDEN);
            }
        }
        return await this.findEventsForUser(eventsUserId, filterType);
    }
}