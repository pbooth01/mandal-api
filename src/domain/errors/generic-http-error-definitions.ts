import { ApplicationBaseError, IErrorDefinition } from "./application-base-error";

const GenericHTTPErrorDefinitions: Record<string, IErrorDefinition> = {
  // Predefined 4xx http errors
  BAD_REQUEST: {
    type: ApplicationBaseError.type.NETWORK,
    code: "BAD_REQUEST",
    message: "Bad request",
    statusCode: 400,
  },
  UNAUTHORIZED: {
    type: ApplicationBaseError.type.NETWORK,
    code: "UNAUTHORIZED",
    message: "Unauthorized",
    statusCode: 401,
  },
  FORBIDDEN: {
    type: ApplicationBaseError.type.NETWORK,
    code: "FORBIDDEN",
    message: "Forbidden",
    statusCode: 403,
  },
  RESOURCE_NOT_FOUND: {
    type: ApplicationBaseError.type.NETWORK,
    code: "RESOURCE_NOT_FOUND",
    message: "Resource not found",
    statusCode: 404,
    meta: {
      translationKey: "app.common.error.RESOURCE_NOT_FOUND",
    }
  },
  // Predefined 5xx http errors
  INTERNAL_SERVER_ERROR: {
    type: ApplicationBaseError.type.NETWORK,
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong, Please try again later.",
    statusCode: 500,
    meta: {
      shouldRedirect: true,
    }
  },
  BAD_GATEWAY: {
    type: ApplicationBaseError.type.NETWORK,
    code: "BAD_GATEWAY",
    message: "Bad gateway",
    statusCode: 502,
  },
  SERVICE_UNAVAILABLE: {
    type: ApplicationBaseError.type.NETWORK,
    code: "SERVICE_UNAVAILABLE",
    message: "Service unavailable",
    statusCode: 503,
  },
  GATEWAY_TIMEOUT: {
    type: ApplicationBaseError.type.NETWORK,
    code: "GATEWAY_TIMEOUT",
    message: "Gateway timeout",
    statusCode: 504,
  },
};

export { GenericHTTPErrorDefinitions };