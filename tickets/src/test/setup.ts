import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import  request  from 'supertest';
import jwt from 'jsonwebtoken'

declare global {
      var signin: () => Promise<string[]>;
    }

jest.mock('../nats-wrapper');

let mongo: any;

// before all tests create mongomemory server and then connect the 
// mongoose to its uri
beforeAll(async () => {
  process.env.JWT_KEY = "ffdfd";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

// before each test delete all the prev data of all the 
// collections in the db
beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// after all the test stop all the mongoose connections to the 
// in memory mongodb
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// fake global signin function which will return 
// cookies to fake a signup
global.signin = async ()=>{
  const payload={
    id: new mongoose.Types.ObjectId().toHexString(),
    email:"test@test.com"
  }
  
  const token = jwt.sign(payload,process.env.JWT_KEY!)
  
  const session = {jwt:token}
  const sessionJSON = JSON.stringify(session)
  
  const base64 =Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`]

}