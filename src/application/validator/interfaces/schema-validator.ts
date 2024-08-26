
export interface ISchemaValidator {
    validateObjectAgainstSchema(objectInstance: any, schemaKey: string): void
}