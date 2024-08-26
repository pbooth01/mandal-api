import { ITransactionController } from "../../../infrastructure/driven-adapters/adapters/mongoose-transaction-controller";

export interface ITransactionRepository {
    getTransactionController(): ITransactionController;
}