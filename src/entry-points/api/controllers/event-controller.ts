import { Request, Response, NextFunction } from 'express'
import { ISchemaValidator } from '../../../application/validator/interfaces/schema-validator';
import { IUserAuthenticationService } from '../../../domain/interfaces/userAuthenticationService';
import { EventModel } from '../../../domain/models/event';
import { IAddUserToEventService } from '../../../domain/use-cases/event/interfaces/add-user-to-event-service';
import { ICreateEventService } from '../../../domain/use-cases/event/interfaces/create-event-service';
import { IDeleteEventService } from '../../../domain/use-cases/event/interfaces/delete-event-service';
import { IFindEventService } from '../../../domain/use-cases/event/interfaces/find-event-service';
import { IFindEventsForUserService } from '../../../domain/use-cases/event/interfaces/find-events-for-user-service';
import { APIResponseObject, AppControllerBase } from './controller-base';

export class EventController extends AppControllerBase {
 
    private readonly createEventService: ICreateEventService;
    private readonly deleteEventService: IDeleteEventService;
    private readonly findEventService: IFindEventService;
    private readonly findEventsForUserService: IFindEventsForUserService;
    private readonly addUserToEventService: IAddUserToEventService;
    private readonly schemaValidator: ISchemaValidator;
    private readonly authService: IUserAuthenticationService;

    constructor(
        createEventService: ICreateEventService,
        deleteEventService: IDeleteEventService,
        findEventService: IFindEventService,
        findEventsForUserService: IFindEventsForUserService,
        addUserToEventService: IAddUserToEventService,
        schemaValidator: ISchemaValidator,
        authService: IUserAuthenticationService
        ) {
        super();
        this.createEventService = createEventService;
        this.deleteEventService = deleteEventService;
        this.findEventService = findEventService;
        this.findEventsForUserService = findEventsForUserService;
        this.addUserToEventService = addUserToEventService;
        this.schemaValidator = schemaValidator;
        this.authService = authService;
    }

    async createEvent(req: Request, res: Response, next: NextFunction) {
        let responseObj: APIResponseObject;
        try{
            const sessionUserId = await this.authService.getLoggedInUser("63a924e13084cf1fb9c69976");
            this.schemaValidator.validateObjectAgainstSchema(req.body, "create_event");
            const createEventRequest = {
                ...req.body, 
                createdBy: sessionUserId
            };
            
            const newEvent: EventModel = await this.createEventService.execute(createEventRequest);
            responseObj = this.generateSuccessfulResponse(201, newEvent);
        }
        catch(error){
            responseObj = this.generateErrorResponse(error);
        }
        res.status(responseObj.code).send(responseObj);
    }
}