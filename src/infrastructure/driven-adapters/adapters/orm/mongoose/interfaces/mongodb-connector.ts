import mongoose, { ClientSession, Model } from "mongoose";

export interface IMongoDBConnector {
    connection: mongoose.Connection;
    getSession(): Promise<ClientSession>;
    initializeDB(dbConnectionString: string, connectionOptions: mongoose.ConnectOptions): void;
    getModel<Type>(modelName: string): Model<Type>;
}