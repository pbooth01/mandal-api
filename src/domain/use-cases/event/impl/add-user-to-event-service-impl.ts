import { ApplicationBaseError } from "../../../errors/application-base-error";
import { EventErrorDefinitions } from "../../../errors/event-error-definitions";
import { GenericHTTPErrorDefinitions } from "../../../errors/generic-http-error-definitions";
import { IEventRepository } from "../../../repositories/interfaces/event-repository";
import { IFollowRepository } from "../../../repositories/interfaces/follow-repository";
import { IAddUserToEventService } from "../interfaces/add-user-to-event-service";

export class AddUserToEventServiceImpl implements IAddUserToEventService {
    constructor(
        private readonly eventRepository: IEventRepository,
        private readonly followRepository: IFollowRepository
    ) {
    }

    async execute(eventId: string, sessionUserId: string): Promise<void> {
        const event = await this.eventRepository.findEventById(eventId);
        if(event === null){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND);
        }
        const isFollower = await this.followRepository.checkIfUserIsFollowedByFollower(event.createdBy._id, sessionUserId);
        if(!isFollower){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.FORBIDDEN);
        }
        // If the event has a parent event then add the user to the parent event, if not, then add the user to the event itself
        // because that means it is the parent.
        const eventIdToAddUserTo = event.parentEvent ? event.parentEvent._id : event._id;
        if(await this.eventRepository.checkUserHasJoinedEvent(eventIdToAddUserTo, sessionUserId)){
            throw new ApplicationBaseError(EventErrorDefinitions.INVALID_JOIN_REQUEST);
        }
        if(event.chainable){
            const transactionController = this.eventRepository.getTransactionController();
            await transactionController.startTransaction({});
            try {
                await this.eventRepository.addUserToEvent(eventIdToAddUserTo, sessionUserId, transactionController.txSession);
                await this.eventRepository.chainEvent(eventIdToAddUserTo, sessionUserId, transactionController.txSession);
            }
            catch(error) {
                transactionController.abortTransaction();
                throw error
            }
            finally{
                await transactionController.endSession();
            }
        }else{
            await this.eventRepository.addUserToEvent(eventIdToAddUserTo, sessionUserId);
        }
    }
}