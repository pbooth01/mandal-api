import { readFileSync } from 'fs';
import Ajv, { DefinedError } from "ajv";
import path from 'path';
import { ISchemaValidator } from '../../../../application/validator/interfaces/schema-validator';
import { ApplicationBaseError } from '../../../../domain/errors/application-base-error';
import { GenericHTTPErrorDefinitions } from '../../../../domain/errors/generic-http-error-definitions';
import { ValidationErrorDefinitions } from '../../../../domain/errors/validation-error-definitions';

export class AJVSchemaValidator implements ISchemaValidator{

    private ajv: Ajv
 
    constructor() {
        const swaggerPath: string = path.join(__dirname, '..', '..', '..', '..', 'swagger');
        this.ajv = new Ajv();
        // Adding example as an accepted keywrd becausse I am using Swagger Definitions and not actual schema definitions. I will try to
        // Do this until it becomes a problem and then I will switch over proper AJV schemas.
        this.ajv.addKeyword("example");

        this.addSchemaToValidator(`${swaggerPath}/resources/user/request_schemas/create_user.json`, "create_user");
        this.addSchemaToValidator(`${swaggerPath}/resources/user/follow_requests/request_schemas/patch_follow_request.json`, "patch_follow_request");
    }
    private getSchemaFile(schemaLocation: string) {
        return readFileSync(schemaLocation, "utf-8")
    }

    private addSchemaToValidator(schemaLocation: string, schemaKey: string): void {
        this.ajv.addSchema(JSON.parse(this.getSchemaFile(schemaLocation)), schemaKey);
    }

    private parseValidationErrorsIntoMessage(validationErrors: DefinedError[]): string{
        let errorMessage = ""
        for (const err of validationErrors) {
            errorMessage = errorMessage + err.message + "|";
        }
        return errorMessage.slice(0, -1);
        
    }

    validateObjectAgainstSchema(objectInstance: any, schemaKey: string): void {
        const validator = this.ajv.getSchema(schemaKey);
        if(validator){
            if(!validator(objectInstance)){
                const ajvfailureMessage = this.parseValidationErrorsIntoMessage(validator.errors as DefinedError[])
                throw(new ApplicationBaseError(ValidationErrorDefinitions.SCHEMA_VALIDATION_FAILURE, { message: ajvfailureMessage }));
            }
        }
        else {
            throw (new ApplicationBaseError(GenericHTTPErrorDefinitions.INTERNAL_SERVER_ERROR));
        }
    }

}