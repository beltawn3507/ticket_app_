import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import  request  from 'supertest';


declare global {
      var signin: () => Promise<string[]>;
    }

let mongo: any;

// before all the test perform this
beforeAll(async () => {
  process.env.JWT_KEY = "ffdfd";
  // create a mongomemory server and get uri of the server
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

// before each task perform this
beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
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
  await mongoose.connection.close();
});


// function to simulate fake login in the server
// this function return the cookie 
global.signin = async ()=>{
  const email = 'random2@gmail.com'
  const password = 'password';

  const response = await request(app)
  .post('/api/users/signup')
  .send({
    email,password
  })
  .expect(201);

  const cookie = response.get("Set-Cookie");

  if (!cookie) {
    throw new Error("Failed to get cookie from response");
  }
  return cookie;

}