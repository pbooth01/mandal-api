import { CreateUserRequestModel } from "../../../../../src/domain/models/createUserRequest";
import { MongoDBUserDataSource } from "../../../../../src/infrastructure/data-access/data-sources/impl/mongodb/mongodb-user-data-source-impl";
import { MongoDBConnection } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/impl/mongodb-connector";
import { UserMongooseRepository } from "../../../../../src/infrastructure/driven-adapters/adapters/orm/mongoose/user-mongoose-repository";
import { MongoTestDBController } from "../../../../../src/tests/mongoose-test-db-controller";

describe("User Mongoose Repository Tests", () => {
    const mongooseTestDbController: MongoTestDBController = new MongoTestDBController(MongoDBConnection);
    const createUserRequestObject: CreateUserRequestModel = {"name": "user1", "email": "user1@gamil.com"};

    // I am using this method because I want to make sure that the DB is setup properly before I do any object instantiation
    function getStaticTestRequirements(){
        const userRepository: UserMongooseRepository = new UserMongooseRepository(new MongoDBUserDataSource(MongoDBConnection));

        return {
            userRepository: userRepository,
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

    describe("Given a valid create user request", () => {
        it("Should Save a new User in the database with matching properties to the request", async () => {

            const {userRepository} = getStaticTestRequirements();

            const newUser = await userRepository.createUser(createUserRequestObject);
            expect(newUser._id).toBeDefined();
            expect(newUser.name).toBe(createUserRequestObject.name);
            expect(newUser.email).toBe(createUserRequestObject.email);
        });
    });

    describe("Given User Exists in the database with email 'user1@gamil.com'", () => {
        it("FindUserByEmail Should find the associated user in the DB with that email", async () => {
            const {userRepository} = getStaticTestRequirements();
            const newUser = await userRepository.createUser(createUserRequestObject);
            expect(newUser._id).toBeDefined();
            expect(newUser.name).toBe(createUserRequestObject.name);
            expect(newUser.email).toBe(createUserRequestObject.email);

            const foundUser = await userRepository.findUserByEmail(newUser.email);
            expect(foundUser).not.toBeNull();
            expect(foundUser?._id).toStrictEqual(newUser._id);
        });
    });

    describe("Given User Exists in the database with email 'user1@gamil.com'", () => {
        it("FindUserById Should find the associated user in the DB with that id", async () => {
            const {userRepository} = getStaticTestRequirements();
            const newUser = await userRepository.createUser(createUserRequestObject);
            expect(newUser._id).toBeDefined();
            expect(newUser.name).toBe(createUserRequestObject.name);
            expect(newUser.email).toBe(createUserRequestObject.email);

            const foundUser = await userRepository.findUserById(newUser._id);
            expect(foundUser).not.toBeNull();
            expect(foundUser?._id).toStrictEqual(newUser._id);
        });
    });

    
})