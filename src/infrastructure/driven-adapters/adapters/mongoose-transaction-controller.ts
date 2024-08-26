import { ClientSession } from "mongoose";
import { ApplicationBaseError } from "../../../domain/errors/application-base-error";
import { GenericHTTPErrorDefinitions } from "../../../domain/errors/generic-http-error-definitions";
import { ITransactionController } from "../../../domain/interfaces/transactionController";
import { IMongoDBConnector } from "./orm/mongoose/interfaces/mongodb-connector";

export class MongooseTransactionController implements ITransactionController {

    private _session: ClientSession | null = null;
    private _dbConnection: IMongoDBConnector

    get txSession(){
        if(this._session === null){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.SERVICE_UNAVAILABLE);
            
        }
        return this._session;
    }

    set txSession(session: ClientSession){
        this._session = session;
    }
 
    constructor(dbConnection: IMongoDBConnector) {
        this._dbConnection = dbConnection;
    }

    async startTransaction(opts: any): Promise<void> {
        if(this.txSession !== null){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.SERVICE_UNAVAILABLE);
        }
        this.txSession = await this._dbConnection.getSession();
        this.txSession.startTransaction(opts);
    }

    commitTransaction(): void {
        this.txSession.commitTransaction();
    }

    abortTransaction(): void {
        this.txSession.abortTransaction();
    }

    async endSession(): Promise<void> {
        await this.txSession.endSession();
    }

}

export { ITransactionController };
