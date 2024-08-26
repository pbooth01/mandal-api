import mongoose, { ClientSession, Model } from 'mongoose';
import { ApplicationBaseError } from '../../../../../../domain/errors/application-base-error';
import { GenericHTTPErrorDefinitions } from '../../../../../../domain/errors/generic-http-error-definitions';
import { IMongoDBConnector } from '../interfaces/mongodb-connector';
import { EventModel } from '../models/event';
import { FollowModel } from '../models/follow';
import { FollowRequestModel } from '../models/followRequest';
import { UserModel } from '../models/user';
import EventModelSchema from '../schemas/event';
import FollowModelSchema, { IFollowMongooseModel } from '../schemas/follow';
import FollowRequestModelSchema, { IFollowRequestMongooseModel } from '../schemas/followRequest';
import UserModelSchema, { IUserMongooseModel } from '../schemas/user';

class MongoDBConnector implements IMongoDBConnector {

    private _connection: mongoose.Connection | null = null;

    public get connection(): mongoose.Connection {
        if(this._connection === null){
            // DB has not been properly initialized EXCEPTION
            // If you are trying to access a connection that is null it means that you have not initialized the DB
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.SERVICE_UNAVAILABLE);
        }
        return this._connection;
    }

    public set connection(newConnection: mongoose.Connection) {
        if(this._connection != null){
             // DB ERROR Cannot change the DB connection once it it set.
            // Make developer create a new connection
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.SERVICE_UNAVAILABLE);
        }
        this._connection = newConnection;
    }

    async initializeDB(dbConnectionString: string, connectionOptions: mongoose.ConnectOptions): Promise<void> {
        try {
            this.connection = mongoose.createConnection(dbConnectionString, connectionOptions);
            this.connection.db
            //Change this to some sort of logging
            console.log("Database has now been initialized");

            this.registerModelsWithConnection();
            console.log("Models Have been registered with connection");
        }
        catch(error){
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.SERVICE_UNAVAILABLE);
        }
    }

    async getSession(): Promise<ClientSession> {
        return await this.connection.startSession() ;
    }

    registerModelsWithConnection() {
        this.connection.model<EventModel>('Event', EventModelSchema);
        this.connection.model<FollowModel, IFollowMongooseModel>('Follow', FollowModelSchema);
        this.connection.model<FollowRequestModel, IFollowRequestMongooseModel>('FollowRequest', FollowRequestModelSchema);
        this.connection.model<UserModel, IUserMongooseModel>('User', UserModelSchema);
    }

    getModel<T>(modelName: string): Model<T> {
        if(!this.connection.modelNames().includes(modelName)){
            // A user is trying to get a model that does not exist.
            throw new ApplicationBaseError(GenericHTTPErrorDefinitions.SERVICE_UNAVAILABLE)
        }
        return this.connection.model(modelName);
    }
}

export const MongoDBConnection = new MongoDBConnector();