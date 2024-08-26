import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { MongoDBConnection } from "../infrastructure/driven-adapters/adapters/orm/mongoose/impl/mongodb-connector";
import { IMongoDBConnector } from "../infrastructure/driven-adapters/adapters/orm/mongoose/interfaces/mongodb-connector";

export class MongoTestDBController {
    dbConn: IMongoDBConnector;
    mongo: MongoMemoryServer | null = null;

    constructor(dbConnection: IMongoDBConnector){
        this.dbConn = dbConnection;
    }

    async connectDB(): Promise<void> {
        this.mongo = await MongoMemoryServer.create();
        const uri = this.mongo.getUri();
        this.dbConn.initializeDB(uri, {
            dbName: "test",
            autoIndex: true
        });
    }

    async dropDB(): Promise<void> {
        if (this.mongo) {
            await this.dbConn.connection.dropDatabase();
            await this.dbConn.connection.close();
            await this.mongo.stop();
        }else{
            throw Error("The MongoDB Memory Server Does Not Exist");
        }
    }

    async dropCollections(): Promise<void> {
        if (this.mongo) {
            const collections = await this.dbConn.connection.db.collections();
            for (let collection of collections) {
                await collection.drop();
            }
        }else{
            throw Error("The MongoDB Memory Server Does Not Exist");
        }
    } 
}