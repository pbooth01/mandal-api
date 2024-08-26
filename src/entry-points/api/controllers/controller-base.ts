import { Request, Response, NextFunction } from 'express'
import { ApplicationBaseError, IErrorDefinition } from '../../../domain/errors/application-base-error';
import { GenericHTTPErrorDefinitions } from '../../../domain/errors/generic-http-error-definitions';

export interface APIResponseObject {
    success: boolean,
    code: number,
    data?: any,
    error?:IErrorDefinition
};

export class AppControllerBase {

    generateSuccessfulResponse(code: number = 200, data: any, overrides: any = {}): APIResponseObject {
        return {
            success: true,
            code: code,
            data: data,
            ...overrides
        };
    }

    // Add some sort of logging here
    generateErrorResponse(error: any, overrides: any = {}): APIResponseObject {
        console.log(error)
        const responseError = error instanceof ApplicationBaseError ? error : new ApplicationBaseError(GenericHTTPErrorDefinitions.INTERNAL_SERVER_ERROR);
        // `Error.stack`'s `enumerable` property descriptor is `false`
        // Thus, `JSON.stringify(...)` doesn't enumerate over it.
        const stackTrace = JSON.stringify(responseError, ['stack'], 4) || {};
        const newError = JSON.parse(JSON.stringify(responseError));

        // No need to send to client
        //delete newError.statusCode
        delete newError.meta

        return {
            success: false,
            code: responseError.statusCode,
            error: {
                ...newError
            }
        }
    }
}