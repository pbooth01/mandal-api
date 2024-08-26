import { ApplicationBaseError } from "../../../../../src/domain/errors/application-base-error";
import { ISchemaValidator } from "../../../../../src/application/validator/interfaces/schema-validator";
import { AJVSchemaValidator } from "../../../../../src/infrastructure/driven-adapters/adapters/validators/ajv-schema-validator";

describe("AJV Validation Service Checks", () => {
    let validatorService: ISchemaValidator

    const validCreateUserRequestObject = {"name": "user1", "email": "user1@gamil.com"};
    const inValidCreateUserRequestObject = {"name": "user1"};

    beforeAll(() => {
        validatorService = new AJVSchemaValidator();
    })

    describe("Given a correct schema definition", () => {
        test("Validator does not throw an exception", () => {
            expect(() => {
                validatorService.validateObjectAgainstSchema(validCreateUserRequestObject, "create_user");
            }).not.toThrow();
        });
    })

    describe("Given an incorrect schema definition is passed to the validator", () => {
        it("should throw a validation error and display the required properties in the message", () => {
            expect.assertions(2);

            try {
                validatorService.validateObjectAgainstSchema(inValidCreateUserRequestObject, "create_user")
            }
            catch(error) {
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("message", "must have required property 'email'");
            }
        });
    })

    describe("Given a non-existent schema key", () => {
        it("should throw an application error Non ExistentSchema Key", () => {
            expect.assertions(2);
            try {
                validatorService.validateObjectAgainstSchema(inValidCreateUserRequestObject, "thisKeyDoesNotExist")
            }
            catch(error) {
                expect(error).toBeInstanceOf(ApplicationBaseError);
                expect(error).toHaveProperty("message", "Something went wrong, Please try again later.");
            }
        });
    })
})