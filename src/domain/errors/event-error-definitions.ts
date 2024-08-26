
import { ApplicationBaseError } from './application-base-error'

export const EventErrorDefinitions = {
  INVALID_EVENT_LENGTH: {
    type: ApplicationBaseError.type.APP_NAME,
    code: 'INVALID_EVENT_LENGTH',
    message: 'Event end time must come after avent start time.',
    statusCode: 400
  },
  INVALID_EVENT_DATE: {
    type: ApplicationBaseError.type.APP_NAME,
    code: 'INVALID_EVENT_DATE',
    message: 'Event start time and end time must come before the current time.',
    statusCode: 400
  },
  INVALID_EVENT_FILTER_PARAMETER: {
    type: ApplicationBaseError.type.APP_NAME,
    code: 'INVALID_EVENT_FILTER_PARAMETER',
    message: 'An Unrecognized filter parameter was passed to the request.',
    statusCode: 422
  },
  INVALID_JOIN_REQUEST: {
    type: ApplicationBaseError.type.APP_NAME,
    code: 'INVALID_JOIN_REQUEST',
    message: 'Attempted to Join an event that you are the owner of.',
    statusCode: 422
  },
}