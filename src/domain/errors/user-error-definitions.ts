
import { ApplicationBaseError } from './application-base-error'

export const UserErrorDefinitions = {
  EMAIL_ALREADY_TAKEN: {
    type: ApplicationBaseError.type.APP_NAME,
    code: 'EMAIL_ALREADY_TAKEN',
    message: 'The given email address is already taken.',
    statusCode: 400
  }
}