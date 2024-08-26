export interface ITransactionController {
    txSession: any 
    startTransaction(opts: any): Promise<void>;
    commitTransaction(): void;
    abortTransaction(): void;
    endSession(): Promise<void>;
}