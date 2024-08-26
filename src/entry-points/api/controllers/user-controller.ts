import { Request, Response, NextFunction } from 'express'
import { UserModel } from '../../../domain/models/user';
import { ICreateUserService } from '../../../domain/use-cases/user/interfaces/create-user-service';
import { ISchemaValidator } from '../../../application/validator/interfaces/schema-validator';
import { APIResponseObject, AppControllerBase } from './controller-base';

export class UserController extends AppControllerBase {
 
    private readonly createUserService: ICreateUserService
    private readonly schemaValidator: ISchemaValidator

    constructor(
        createUserService: ICreateUserService,
        schemaValidator: ISchemaValidator
        ) {
        super();
        this.createUserService = createUserService;
        this.schemaValidator = schemaValidator;
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        let responseObj: APIResponseObject;
        try{
            this.schemaValidator.validateObjectAgainstSchema(req.body, "create_user");
            const newUser: UserModel = await this.createUserService.execute(req.body);
            responseObj = this.generateSuccessfulResponse(201, newUser);
        }
        catch(error){
            responseObj = this.generateErrorResponse(error);
        }
        res.status(responseObj.code).send(responseObj);
    }
}