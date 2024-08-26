import { ApplicationBaseError } from "../../../errors/application-base-error";
import { FollowRequestErrorDefinitions } from "../../../errors/follow-request-error-definitions";
import { GenericHTTPErrorDefinitions } from "../../../errors/generic-http-error-definitions";
import { FollowRequestModel } from "../../../models/followRequest";
import { IFollowRequestRepository } from "../../../repositories/interfaces/follow-request-repository";
import { ICreateFollowRequestService } from "../interfaces/create-follow-request";

export class CreateFollowRequestServiceImpl implements ICreateFollowRequestService {

    constructor(
        private readonly followRequestRepository: IFollowRequestRepository
    ) {}

    async execute(sessionUserId: string, userId: string): Promise<FollowRequestModel> {
        const existingFollowRequest = await this.followRequestRepository.findFollowRequestByUserAndRequester(userId, sessionUserId);
        if(existingFollowRequest !== null){
            throw new ApplicationBaseError(FollowRequestErrorDefinitions.EXISTING_FOLLOW_REQUEST);
        }
        // A user can only create a follow request record to follow a different user that is not themselves.
        if(sessionUserId === userId){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.BAD_REQUEST)
        }
        return await this.followRequestRepository.createFollowRequest(userId, sessionUserId);
    } 
}