import { CreateUserRequestModel } from "../../../../../src/domain/models/createUserRequest";
import { MongoDBFollowDataSource } from "../../../../../src/infrastructure/data-access/data-sources/impl/mongodb/mongodb-follow-data-source-impl";
import { MongoDBUserDataSource } from "../../../../../src/infrastructure/data-access/data-sources/impl/mongodb/mongodb-user-data-source-impl";
import { FollowMongooseRepository } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/follow-mongoose-repository";
import { MongoDBConnection } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/impl/mongodb-connector";
import { UserMongooseRepository } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/user-mongoose-repository";
import { MongoTestDBController } from "../../../../../src/tests/mongoose-test-db-controller";

describe("Follow Mongoose Repository Tests", () => {
    const mongooseTestDbController: MongoTestDBController = new MongoTestDBController(MongoDBConnection);
    const createUserRequestObject1: CreateUserRequestModel = {"name": "user1", "email": "user1@gamil.com"};
    const createUserRequestObject2: CreateUserRequestModel = {"name": "user2", "email": "user2@gamil.com"};

    // I am using this method because I want to make sure that the DB is setup properly before I do any object instantiation
    function getStaticTestRequirements(){
        const userRepository: UserMongooseRepository = new UserMongooseRepository(new MongoDBUserDataSource(MongoDBConnection));
        const followRepository: FollowMongooseRepository = new FollowMongooseRepository(new MongoDBFollowDataSource(MongoDBConnection));
        return {
            userRepository: userRepository,
            followRepository: followRepository
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
        it("Should create a new follow request in the database", async () => {
            const {userRepository, followRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRepository.createFollowRecord(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toBe(newUser1._id);
            expect(newFollowRecord.follower).toStrictEqual(newUser2._id);
        });
    });

    describe("Given a valid follow request exists", () => {
        it("FindFollowRequestByUserAndFollower Should fond that follow request in the database", async () => {
            const {userRepository, followRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRepository.createFollowRecord(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toStrictEqual(newUser1._id);
            expect(newFollowRecord.follower).toStrictEqual(newUser2._id);

            const foundFollowRecord = await followRepository.findFollowRecordByUserAndFollower(newUser1._id, newUser2._id);
            expect(foundFollowRecord?._id).toBeDefined();
            expect(foundFollowRecord?.user).toStrictEqual(newUser1._id);
            expect(foundFollowRecord?.follower).toStrictEqual(newUser2._id);
        });

        it("FindFollowRequestByUserAndFollower Should not find a follow request in the database if user and follower are reversed", async () => {
            const {userRepository, followRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRepository.createFollowRecord(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toStrictEqual(newUser1._id);
            expect(newFollowRecord.follower).toStrictEqual(newUser2._id);

            const foundFollowRecord = await followRepository.findFollowRecordByUserAndFollower(newUser2._id,newUser1._id);
            expect(foundFollowRecord).toBeNull();
        });

        it("FindFollowRequestByUser Should return an array of follow objects for the user", async () => {
            const {userRepository, followRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRepository.createFollowRecord(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toStrictEqual(newUser1._id);
            expect(newFollowRecord.follower).toStrictEqual(newUser2._id);

            const newFollowRecord2 = await followRepository.createFollowRecord(newUser2._id, newUser1._id);
            expect(newFollowRecord2._id).toBeDefined();
            expect(newFollowRecord2.user).toStrictEqual(newUser2._id);
            expect(newFollowRecord2.follower).toStrictEqual(newUser1._id);

            const foundFollowRecords = await followRepository.findFollowRecordsForUser(newUser1._id);
            expect(foundFollowRecords.length).toBe(1);
            expect(foundFollowRecords[0]._id).toStrictEqual(newFollowRecord._id);
        });

        it("checkIfUserIsFollowedByFollower Should return true", async () => {
            const {userRepository, followRepository} = getStaticTestRequirements();
            const newUser1 = await userRepository.createUser(createUserRequestObject1);
            expect(newUser1._id).toBeDefined();
            expect(newUser1.name).toBe(createUserRequestObject1.name);
            expect(newUser1.email).toBe(createUserRequestObject1.email);

            const newUser2 = await userRepository.createUser(createUserRequestObject2);
            expect(newUser2._id).toBeDefined();
            expect(newUser2.name).toBe(createUserRequestObject2.name);
            expect(newUser2.email).toBe(createUserRequestObject2.email);

            const newFollowRecord = await followRepository.createFollowRecord(newUser1._id, newUser2._id);
            expect(newFollowRecord._id).toBeDefined();
            expect(newFollowRecord.user).toStrictEqual(newUser1._id);
            expect(newFollowRecord.follower).toStrictEqual(newUser2._id);

            const isFollower = await followRepository.checkIfUserIsFollowedByFollower(newUser1._id, newUser2._id);
            expect(isFollower).toBe(true);
        });
    });
})