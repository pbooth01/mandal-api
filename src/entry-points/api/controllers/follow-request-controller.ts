import { Request, Response, NextFunction } from 'express'
import { APIResponseObject, AppControllerBase } from './controller-base';
import { ICreateFollowRequestService } from '../../../domain/use-cases/follow-request/interfaces/create-follow-request';
import { FollowRequestModel } from '../../../domain/models/followRequest';
import { IUpdateFollowRequestStatusService } from '../../../domain/use-cases/follow-request/interfaces/update-follow-request-status';
import { ApplicationBaseError } from '../../../domain/errors/application-base-error';
import { GenericHTTPErrorDefinitions } from '../../../domain/errors/generic-http-error-definitions';
import { IGetFollowRequestsService } from '../../../domain/use-cases/follow-request/interfaces/get-follow-requests';
import { FollowRequestStatus } from '../../../domain/types/follow-request-status';
import { ISchemaValidator } from '../../../application/validator/interfaces/schema-validator';
import { FollowRequestListItem } from '../../../domain/models/followRequestListItem';
import { IUserAuthenticationService } from '../../../domain/interfaces/userAuthenticationService';

export class FollowRequestController extends AppControllerBase {
 
    private readonly createFollowRequestService: ICreateFollowRequestService;
    private readonly updateFollowRequestService: IUpdateFollowRequestStatusService;
    private readonly getFollowRequestsService: IGetFollowRequestsService;
    private readonly schemaValidator: ISchemaValidator;
    private readonly authService: IUserAuthenticationService

    constructor(
        getFollowRequestsService: IGetFollowRequestsService,
        createFollowRequestService: ICreateFollowRequestService,
        updateFollowRequestService: IUpdateFollowRequestStatusService,
        schemaValidator: ISchemaValidator,
        authService: IUserAuthenticationService
        ) {
        super();
        this.createFollowRequestService = createFollowRequestService;
        this.updateFollowRequestService = updateFollowRequestService;
        this.getFollowRequestsService = getFollowRequestsService;
        this.schemaValidator = schemaValidator;
        this.authService = authService;
    }

    async getFollowRequests(req: Request, res: Response, next: NextFunction) {
        let responseObj: APIResponseObject;
        try{
            const userToGetRequestsFor = req.params.userId;
            const requestStatus = req.query.requestStatus;
            const sessionUserId = await this.authService.getLoggedInUser("639fdb4795589d5d56322fe9");

            if(!userToGetRequestsFor){
                throw new ApplicationBaseError(GenericHTTPErrorDefinitions.BAD_REQUEST);
            }

            if(userToGetRequestsFor !== sessionUserId){
                throw new ApplicationBaseError(GenericHTTPErrorDefinitions.FORBIDDEN);
            }

            const followRequests: FollowRequestListItem[] = await this.getFollowRequestsService.execute(userToGetRequestsFor, requestStatus as FollowRequestStatus || null);
            responseObj = this.generateSuccessfulResponse(200, followRequests);
        }
        catch(error){
            responseObj = this.generateErrorResponse(error);
        }
        res.status(responseObj.code).send(responseObj);
    }

    async createFollowRequest(req: Request, res: Response, next: NextFunction) {
        let responseObj: APIResponseObject;
        try{
            const userToFollow = req.params.userId;
            const sessionUserId = await this.authService.getLoggedInUser("639fdb4795589d5d56322fe9");

            if(!userToFollow){
                throw new ApplicationBaseError(GenericHTTPErrorDefinitions.BAD_REQUEST)
            }

            const newFollowRequest: FollowRequestModel = await this.createFollowRequestService.execute(sessionUserId, userToFollow);
            responseObj = this.generateSuccessfulResponse(201, newFollowRequest);
        }
        catch(error){
            responseObj = this.generateErrorResponse(error);
        }
        res.status(responseObj.code).send(responseObj);
    }

    async updateFollowRequest(req: Request, res: Response, next: NextFunction) {
        let responseObj: APIResponseObject;
        try{
            const requestId = req.params.requestId;
            const sessionUserId = await this.authService.getLoggedInUser("639fdb4795589d5d56322fe9");

            if(!requestId){
                throw new ApplicationBaseError(GenericHTTPErrorDefinitions.BAD_REQUEST);
            }
            
            this.schemaValidator.validateObjectAgainstSchema(req.body, "patch_follow_request");
            req.body.requestStatus = req.body.requestStatus.toUpperCase();

            const updatedFollowRequest: FollowRequestModel = await this.updateFollowRequestService.execute(sessionUserId, requestId, req.body.requestStatus as FollowRequestStatus);
            responseObj = this.generateSuccessfulResponse(200, updatedFollowRequest);
        }
        catch(error){
            responseObj = this.generateErrorResponse(error);
        }
        res.status(responseObj.code).send(responseObj);
    }
}