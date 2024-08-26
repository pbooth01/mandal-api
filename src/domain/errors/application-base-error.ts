
export interface IErrorDefinition {
  name?: string,
  type: string;
  code: string;
  statusCode: number
  message: string;
  meta?: any
}

export class ApplicationBaseError extends Error {
  static type = {
    APP_NAME: "APP_NAME",
    INTERNAL: "INTERNAL",
    NETWORK: "NETWORK",
    UNKNOWN: "UNKNOWN",
  };

  name: string;
  type: string;
  code: string;
  statusCode: number
  message: string;
  meta: any

  constructor(options: IErrorDefinition, overrides?: any) {
    super();
    Object.assign(options, overrides);

    if (!ApplicationBaseError.type.hasOwnProperty(options.type)) {
      throw new Error(`ApplicationError: ${options.type} is not a valid type.`);
    }

    if (!options.message) {
      throw new Error("ApplicationError: error message required.");
    }

    if (!options.code) {
      throw new Error("ApplicationError: error code required.");
    }

    this.name = "ApplicationError";
    this.type = options.type;
    this.code = options.code;
    this.message = overrides?.message || options.message;
    this.meta = options.meta;
    this.statusCode = options.statusCode;
  }
}