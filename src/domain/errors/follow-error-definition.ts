import { ApplicationBaseError } from './application-base-error'

export const FollowErrorDefinitions = {
    EXISTING_FOLLOW_RECORD: {
    type: ApplicationBaseError.type.APP_NAME,
    code: 'EXISTING_FOLLOW_RECORD',
    message: 'An existing follow record already exists.',
    statusCode: 422
  },
}