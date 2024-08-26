import { ITransactionController } from "../../../driven-adapters/adapters/mongoose-transaction-controller";

export interface ITransactionDataSource {
    getTransactionController(): ITransactionController;
}