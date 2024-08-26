import { ApplicationBaseError } from './application-base-error'

export const ValidationErrorDefinitions = {
  SCHEMA_VALIDATION_FAILURE: {
    type: ApplicationBaseError.type.APP_NAME,
    code: 'SCHEMA_VALIDATION_FAILURE',
    message: 'An invalid request object was sent to the server.',
    statusCode: 400
  }
}