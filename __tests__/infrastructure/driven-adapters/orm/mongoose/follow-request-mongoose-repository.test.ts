import { CreateUserRequestModel } from "../../../../../src/domain/models/createUserRequest";
import { FollowRequestStatus } from "../../../../../src/domain/types/follow-request-status";
import { MongoDBFollowRequestDataSource } from "../../../../../src/infrastructure/data-access/data-sources/impl/mongodb/mongodb-follow-request-data-source-impl";
import { MongoDBUserDataSource } from "../../../../../src/infrastructure/data-access/data-sources/impl/mongodb/mongodb-user-data-source-impl";
import { FollowRequestMongooseRepository } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/follow-request-mongoose-repository";
import { MongoDBConnection } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/impl/mongodb-connector";
import { UserMongooseRepository } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/user-mongoose-repository";
import { MongoTestDBController } from "../../../../../src/tests/mongoose-test-db-controller";

describe("Follow Request Mongoose Repository Tests", () => {
    const mongooseTestDbController: MongoTestDBController = new MongoTestDBController(MongoDBConnection);
    const createUserRequestObject1: CreateUserRequestModel = {"name": "user1", "email": "user1@gamil.com"};
    const createUserRequestObject2: CreateUserRequestModel = {"name": "user2", "email": "user2@gamil.com"};

    // I am using this method because I want to make sure that the DB is setup properly before I do any object instantiation
    function getStaticTestRequirements(){
        const userRepository: UserMongooseRepository = new UserMongooseRepository(new MongoDBUserDataSource(MongoDBConnection));
        const followRequestRepository: FollowRequestMongooseRepository = new FollowRequestMongooseRepository(new MongoDBFollowRequestDataSource(MongoDBConnection));
        return {
            userRepository: userRepository,
            followRequestRepository: followRequestRepository
        }
    }

    beforeAll( async () => {
        await mongooseTestDbController.connectDB();
    });

    afterAll( async () => {
        await mongooseTestDbController.dropDB();
    })

    afterEach( async () => {
        await mongooseTestDbController.dropCollections();
    })

    describe("Given two valid users", () => {
        it("Should create a new follow request record in the database", async () => {
            const {userRepository, followRequestRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRequestRepository.createFollowRequest(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toBe(newUser1._id.toString());
            expect(newFollowRecord.followRequester).toStrictEqual(newUser2._id.toString());
            expect(newFollowRecord.requestStatus).toStrictEqual("PENDING");
        });
    });

    describe("Given a valid follow request exists", () => {
        it("findFollowRequestByUserAndRequester Should fond that follow request in the database", async () => {
            const {userRepository, followRequestRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRequestRepository.createFollowRequest(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toBe(newUser1._id.toString());
            expect(newFollowRecord.followRequester).toBe(newUser2._id.toString());

            const foundFollowRecord = await followRequestRepository.findFollowRequestByUserAndRequester(newUser1._id, newUser2._id);
            expect(foundFollowRecord?._id).toBeDefined();
            expect(foundFollowRecord?.user).toBe(newUser1._id.toString());
            expect(foundFollowRecord?.followRequester).toBe(newUser2._id.toString());
        });

        it("findFollowRequestByUserAndRequester Should not find a follow request in the database if user and follower are reversed", async () => {
            const {userRepository, followRequestRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRequestRepository.createFollowRequest(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toBe(newUser1._id.toString());
            expect(newFollowRecord.followRequester).toBe(newUser2._id.toString());

            const foundFollowRecord = await followRequestRepository.findFollowRequestByUserAndRequester(newUser2._id,newUser1._id);
            expect(foundFollowRecord).toBeNull();
        });

        it("findFollowRequestRecordsByUserId Should return an array of follow objects for the user", async () => {
            const {userRepository, followRequestRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRequestRepository.createFollowRequest(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toBe(newUser1._id.toString());
            expect(newFollowRecord.followRequester).toBe(newUser2._id.toString());

            const newFollowRecord2 = await followRequestRepository.createFollowRequest(newUser2._id, newUser1._id);
            expect(newFollowRecord2._id).toBeDefined();
            expect(newFollowRecord2.user).toBe(newUser2._id.toString());
            expect(newFollowRecord2.followRequester).toBe(newUser1._id.toString());

            const foundFollowRecords = await followRequestRepository.findFollowRequestRecordsByUserId(newUser1._id);
            expect(foundFollowRecords.length).toBe(1);
            expect(foundFollowRecords[0]._id).toStrictEqual(newFollowRecord._id);
        });

        it("Calling updateStatusOfFollowRequest with status ACCEPTED should return the same follow request with it's status updated", async () => {
            const {userRepository, followRequestRepository} = getStaticTestRequirements();
            const createUserRequestObject3: CreateUserRequestModel = {"name": "user3", "email": "user3@gamil.com"};

            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRequestRepository.createFollowRequest(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toBe(newUser1._id.toString());
            expect(newFollowRecord.followRequester).toBe(newUser2._id.toString());

            const updatedFollowRequest = await followRequestRepository.updateStatusOfFollowRequest(newFollowRecord._id, FollowRequestStatus.ACCEPTED);

            expect(updatedFollowRequest?._id).toStrictEqual(newFollowRecord._id);
            expect(updatedFollowRequest?.requestStatus).toBe("ACCEPTED");
        });

        describe("Given that Multiple Follow Requests Exist one with status 'Pending' and one with 'Accepted' " , () => {

            it("findFollowRequestRecordsByUserIdAndRequestStatus with a status of 'PENDING' return an array of follow objects for the user with status 'PENDING'", async () => {
                const {userRepository, followRequestRepository} = getStaticTestRequirements();
                const createUserRequestObject1: CreateUserRequestModel = {"name": "user1", "email": "user1@gamil.com"};
                const createUserRequestObject2: CreateUserRequestModel = {"name": "user2", "email": "user2@gamil.com"};
                const createUserRequestObject3: CreateUserRequestModel = {"name": "user3", "email": "user3@gamil.com"};
    
                const newUser1 = await userRepository.createUser(createUserRequestObject1);
                expect(newUser1._id).toBeDefined();
                expect(newUser1.name).toBe(createUserRequestObject1.name);
                expect(newUser1.email).toBe(createUserRequestObject1.email);
    
                const newUser2 = await userRepository.createUser(createUserRequestObject2);
                expect(newUser2._id).toBeDefined();
                expect(newUser2.name).toBe(createUserRequestObject2.name);
                expect(newUser2.email).toBe(createUserRequestObject2.email);
    
                const newUser3 = await userRepository.createUser(createUserRequestObject3);
                expect(newUser3._id).toBeDefined();
                expect(newUser3.name).toBe(createUserRequestObject3.name);
                expect(newUser3.email).toBe(createUserRequestObject3.email);
    
                const newFollowRecord = await followRequestRepository.createFollowRequest(newUser1._id, newUser2._id);
                expect(newFollowRecord._id).toBeDefined();
                expect(newFollowRecord.user).toBe(newUser1._id.toString());
                expect(newFollowRecord.followRequester).toBe(newUser2._id.toString());
    
                const newFollowRecord2 = await followRequestRepository.createFollowRequest(newUser1._id, newUser3._id);
                expect(newFollowRecord2._id).toBeDefined();
                expect(newFollowRecord2.user).toBe(newUser1._id.toString());
                expect(newFollowRecord2.followRequester).toBe(newUser3._id.toString());
    
                let foundFollowRecords = await followRequestRepository.findFollowRequestRecordsByUserIdAndRequestStatus(newUser1._id, FollowRequestStatus.PENDING);
                expect(foundFollowRecords.length).toBe(2);  
                expect(foundFollowRecords[0]._id).toStrictEqual(newFollowRecord._id);
                expect(foundFollowRecords[1]._id).toStrictEqual(newFollowRecord2._id);
    
                const updatedFollowRequest = await followRequestRepository.updateStatusOfFollowRequest(newFollowRecord._id, FollowRequestStatus.ACCEPTED);
    
                foundFollowRecords = await followRequestRepository.findFollowRequestRecordsByUserIdAndRequestStatus(newUser1._id, FollowRequestStatus.PENDING);
                expect(foundFollowRecords.length).toBe(1);  
                expect(foundFollowRecords[0]._id).toStrictEqual(newFollowRecord2._id);
            });
        })
    });
})