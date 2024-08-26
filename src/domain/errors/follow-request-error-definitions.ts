import { ApplicationBaseError } from './application-base-error'

export const FollowRequestErrorDefinitions = {
  EXISTING_FOLLOW_REQUEST: {
    type: ApplicationBaseError.type.APP_NAME,
    code: 'EXISTING_FOLLOW_REQUEST',
    message: 'An existing follow request already exists.',
    statusCode: 422
  },
}