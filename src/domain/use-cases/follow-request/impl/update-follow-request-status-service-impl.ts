import { ApplicationBaseError } from "../../../errors/application-base-error";
import { FollowErrorDefinitions } from "../../../errors/follow-error-definition";
import { GenericHTTPErrorDefinitions } from "../../../errors/generic-http-error-definitions";
import { FollowRequestModel } from "../../../models/followRequest";
import { FollowRequestStatus } from "../../../types/follow-request-status";
import { ITransactionController} from "../../../../infrastructure/driven-adapters/adapters/mongoose-transaction-controller";
import { IFollowRepository } from "../../../repositories/interfaces/follow-repository";
import { IFollowRequestRepository } from "../../../repositories/interfaces/follow-request-repository";
import { IUpdateFollowRequestStatusService } from "../interfaces/update-follow-request-status";

export class UpdateFollowRequestServiceImpl implements IUpdateFollowRequestStatusService {
    
    constructor(
        private readonly followRequestRepository: IFollowRequestRepository,
        private readonly followRepository: IFollowRepository
    ) {}

    async execute(sessionUserId: string, requestId: string, requestStatus: FollowRequestStatus): Promise<FollowRequestModel> {
        let followRequestResponse: FollowRequestModel | null = null;

        const originalFollowRequest = await this.followRequestRepository.findFollowRequestById(requestId);
        if(originalFollowRequest === null){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.RESOURCE_NOT_FOUND);
        }
        // Only the user that is being requested can change the status of the request. They are approving or denying a person's right
        // to follow them.
        if(originalFollowRequest.user !== sessionUserId){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.FORBIDDEN);
        }

        const existingFollowRecord = await this.followRepository.findFollowRecordByUserAndFollower(originalFollowRequest.user, originalFollowRequest.followRequester);
        if(existingFollowRecord !== null){
            throw new ApplicationBaseError(FollowErrorDefinitions.EXISTING_FOLLOW_RECORD);
        }

        const transactionController: ITransactionController = this.followRequestRepository.getTransactionController();
        await transactionController.startTransaction({});
        try{
            followRequestResponse = await this.followRequestRepository.updateStatusOfFollowRequest(requestId, requestStatus, transactionController.txSession);
            if(followRequestResponse?.requestStatus === "ACCEPTED"){
                await this.followRepository.createFollowRecord(originalFollowRequest.user, originalFollowRequest.followRequester, transactionController.txSession);
            }
            transactionController.commitTransaction();
        }catch(error){
            transactionController.abortTransaction();
            throw error;
        }
        finally {
            transactionController.endSession();
        }
        // IF we make it here and the followRequestResponse is null then somehting unexpected went wrong.
        if(followRequestResponse === null){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.INTERNAL_SERVER_ERROR);
        }

        return followRequestResponse;
    }
}