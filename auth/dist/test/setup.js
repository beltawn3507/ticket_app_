"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
let mongo;
// before all the test perform this
beforeAll(async () => {
    process.env.JWT_KEY = "ffdfd";
    // create a mongomemory server and get uri of the server
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose_1.default.connect(mongoUri, {});
});
// before each task perform this
beforeEach(async () => {
    if (mongoose_1.default.connection.db) {
        const collections = await mongoose_1.default.connection.db.collections();
        // for all the collection erase all the data
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});
// after all test delete all the mongo data
afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose_1.default.connection.close();
});
// function to simulate fake login in the server
// this function return the cookie 
global.signin = async () => {
    const email = 'random2@gmail.com';
    const password = 'password';
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email, password
    })
        .expect(201);
    const cookie = response.get("Set-Cookie");
    if (!cookie) {
        throw new Error("Failed to get cookie from response");
    }
    return cookie;
};
