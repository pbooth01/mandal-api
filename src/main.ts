import { CreateUserServiceImpl } from './domain/use-cases/user/impl/create-user-service-impl';
import { MongoDBUserDataSource } from './infrastructure/data-access/data-sources/impl/mongodb/mongodb-user-data-source-impl';
import { UserMongooseRepository } from './infrastructure/driven-adapters/adapters/orm/mongoose/user-mongoose-repository';
import { UserController } from './entry-points/api/controllers/user-controller';
import UserRouter from './entry-points/api/routes/user-router';
import server from './application/server';
import { AJVSchemaValidator } from './infrastructure/driven-adapters/adapters/validators/ajv-schema-validator';
import { MongoDBConnection } from './infrastructure/driven-adapters/adapters/orm/mongoose/impl/mongodb-connector';
import { FollowRequestController } from './entry-points/api/controllers/follow-request-controller';
import { CreateFollowRequestServiceImpl } from './domain/use-cases/follow-request/impl/create-follow-request-service-impl';
import { FollowRequestMongooseRepository } from './infrastructure/driven-adapters/adapters/orm/mongoose/follow-request-mongoose-repository';
import { MongoDBFollowRequestDataSource } from './infrastructure/data-access/data-sources/impl/mongodb/mongodb-follow-request-data-source-impl';
import { UpdateFollowRequestServiceImpl } from './domain/use-cases/follow-request/impl/update-follow-request-status-service-impl';
import { MongoDBFollowDataSource } from './infrastructure/data-access/data-sources/impl/mongodb/mongodb-follow-data-source-impl';
import { FollowMongooseRepository } from './infrastructure/driven-adapters/adapters/orm/mongoose/follow-mongoose-repository';
import { GetFollowRequestsServiceImpl } from './domain/use-cases/follow-request/impl/get-follow-requests-service-impl';
import EventRouter from './entry-points/api/routes/event-router';
import { IUserAuthenticationService } from './domain/interfaces/userAuthenticationService';
import { FirebaseAuthService } from './infrastructure/authentication/firebaseAuthService';
import { EventController } from './entry-points/api/controllers/event-controller';
import { CreateEventServiceImpl } from './domain/use-cases/event/impl/create-event-service-impl';
import { DeleteEventServiceImpl } from './domain/use-cases/event/impl/delete-event-service-impl';
import { FindEventServiceImpl } from './domain/use-cases/event/impl/find-event-service-impl';
import { FindEventsForUserServiceImpl } from './domain/use-cases/event/impl/find-events-for-user-service-impl';
import { AddUserToEventServiceImpl } from './domain/use-cases/event/impl/add-user-to-event-service-impl';
import { EventMongooseRepository } from './infrastructure/driven-adapters/adapters/orm/mongoose/event-mongoose-repository';
import { MongoDBEventDataSource } from './infrastructure/data-access/data-sources/impl/mongodb/mongodb-event-data-source-impl';

(async () => {

    const mongoDBUsername: string = process.env.MONGO_INITDB_USERNAME || "";
    const mongoDBPassword: string = process.env.MONGO_INITDB_PASSWORD || "";
    const mongoDBDatabase: string = process.env.MONGO_INITDB_DATABASE || "";

    MongoDBConnection.initializeDB(`mongodb://${mongoDBUsername}:${mongoDBPassword}@mongodb:27017/${mongoDBDatabase}`, {});

    const port = process.env.PORT || 8000
    const userDataSource = new MongoDBUserDataSource(MongoDBConnection);
    const followRequestDataSource = new MongoDBFollowRequestDataSource(MongoDBConnection);
    const followDataSource = new MongoDBFollowDataSource(MongoDBConnection);
    const eventDataSource = new MongoDBEventDataSource(MongoDBConnection);
    const ajvSchemaValidator: AJVSchemaValidator = new AJVSchemaValidator();
    const authService: IUserAuthenticationService = new FirebaseAuthService();

    const userMiddleWare = UserRouter(
        new UserController(
            new CreateUserServiceImpl(
                new UserMongooseRepository(userDataSource)
            ),
            ajvSchemaValidator
        ),
        new FollowRequestController(
            new GetFollowRequestsServiceImpl(
                new FollowRequestMongooseRepository(followRequestDataSource)
            ),
            new CreateFollowRequestServiceImpl(
                new FollowRequestMongooseRepository(followRequestDataSource)
            ),
            new UpdateFollowRequestServiceImpl(
                new FollowRequestMongooseRepository(followRequestDataSource),
                new FollowMongooseRepository(followDataSource)
            ),
            ajvSchemaValidator,
            authService
        )
    );

    const eventMiddleWare = EventRouter(
        new EventController (
            new CreateEventServiceImpl(
                new EventMongooseRepository(eventDataSource)
            ),
            new DeleteEventServiceImpl(
                new EventMongooseRepository(eventDataSource)
            ),
            new FindEventServiceImpl(
                new EventMongooseRepository(eventDataSource),
                new FollowMongooseRepository(followDataSource)
            ),
            new FindEventsForUserServiceImpl(
                new EventMongooseRepository(eventDataSource),
                new FollowMongooseRepository(followDataSource)
            ),
            new AddUserToEventServiceImpl(
                new EventMongooseRepository(eventDataSource),
                new FollowMongooseRepository(followDataSource)
            ),
            ajvSchemaValidator,
            authService
        )
    )

    // Configuring the corresponding endpoints
    server.use('/api/v1/users', userMiddleWare);
    server.use('/api/v1/events', eventMiddleWare);

    server.listen(port, () => console.log(`Running on http://localhost:${port}`));
})()