import { FollowRequestModel } from "../../../models/followRequest";
import { FollowRequestListItem } from "../../../models/followRequestListItem";
import { FollowRequestStatus } from "../../../types/follow-request-status";
import { IFollowRequestRepository } from "../../../repositories/interfaces/follow-request-repository";
import { IGetFollowRequestsService } from "../interfaces/get-follow-requests";

export class GetFollowRequestsServiceImpl implements IGetFollowRequestsService {
    
    constructor(
        private readonly followRequestRepository: IFollowRequestRepository,
    ) {}

    async execute(sessionUserId: string, requestStatus: FollowRequestStatus | null): Promise<FollowRequestListItem[]> {
        let followRequestList: FollowRequestListItem[] = [];
        if(requestStatus === null){
            followRequestList = await this.followRequestRepository.findFollowRequestRecordsByUserId(sessionUserId);
        }else{
            followRequestList = await this.followRequestRepository.findFollowRequestRecordsByUserIdAndRequestStatus(sessionUserId, requestStatus);
        }
        return followRequestList;
    }
}