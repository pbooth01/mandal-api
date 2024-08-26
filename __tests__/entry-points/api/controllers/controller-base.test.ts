import { ApplicationBaseError } from "../../../../src/domain/errors/application-base-error";
import { GenericHTTPErrorDefinitions } from "../../../../src/domain/errors/generic-http-error-definitions";
import { ValidationErrorDefinitions } from "../../../../src/domain/errors/validation-error-definitions";
import { AppControllerBase, APIResponseObject } from "../../../../src/entry-points/api/controllers/controller-base";

describe("App Controller Base Tests", () => {
    const createUserRequestObject = {"name": "user1", "email": "user1@gamil.com"};

    const successMessage = {
        success: true,
        code: 201,
        data: createUserRequestObject
    };

    const errorMessage = {
        success: false,
        code: 500,
        error: {
            statusCode: 500,
            name: "ApplicationError",
            type: ApplicationBaseError.type.NETWORK,
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong, Please try again later."
        }
    }

    let appControllerBase: AppControllerBase;

    beforeAll(() => {
        appControllerBase = new AppControllerBase();
    })

    describe("Given a call to generate Success Response", () => {
        it("should return an APIResponseObject with data and without errors", () => {
            const generatedMessage = appControllerBase.generateSuccessfulResponse(201, createUserRequestObject);
            expect(generatedMessage).toHaveProperty("success", true);
            expect(generatedMessage).toHaveProperty("code", 201);
            expect(generatedMessage).toHaveProperty("data", createUserRequestObject);
            expect(generatedMessage).not.toHaveProperty("error");
        });
    });

    describe("Given a call to generate Success message with the create user request object", () => {
        it("should return a message that matches the success message", () => {
            expect(appControllerBase.generateSuccessfulResponse(201, createUserRequestObject)).toStrictEqual(successMessage);
        });
    });

    describe("Given a call to generate Error Response with a valid application error", () => {
        it("should return an APIResponseObject with an error but without data", () => {
            const applicationError = new ApplicationBaseError(GenericHTTPErrorDefinitions.BAD_REQUEST);
            const generatedMessage = appControllerBase.generateErrorResponse(applicationError);
            expect(generatedMessage).toHaveProperty("success", false);
            expect(generatedMessage).toHaveProperty("code", 400);
            expect(generatedMessage).toHaveProperty("error");
            expect(generatedMessage.error?.message).toBe("Bad request");
            expect(generatedMessage).not.toHaveProperty("data");
        });
    });

    describe("Given a call to generate Error Response with a valid validation error", () => {
        it("should return an APIResponseObject with an associated validation error", () => {
            const validationError = new ApplicationBaseError(ValidationErrorDefinitions.SCHEMA_VALIDATION_FAILURE);
            const generatedMessage = appControllerBase.generateErrorResponse(validationError);
            expect(generatedMessage).toHaveProperty("success", false);
            expect(generatedMessage).toHaveProperty("code", 400);
            expect(generatedMessage).toHaveProperty("error");
            expect(generatedMessage.error?.message).toBe("An invalid request object was sent to the server.");
            expect(generatedMessage).not.toHaveProperty("data");
        });
    });

    describe("Given a call to generate Error Response with a non-error object", () => {
        it("should return an APIResponseObject with a 500 code and a message of 'An Unexpected Error Occured'", () => {
            const generatedMessage = appControllerBase.generateErrorResponse({});
            expect(generatedMessage).toStrictEqual(errorMessage);
        });
    });


})