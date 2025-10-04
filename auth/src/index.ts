import {app} from './app'
import mongoose from "mongoose";


const start = async () => {

   if(!process.env.JWT_KEY){
    throw new Error('JWT KEY must be defined')
   }


    try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log('Connected to mongo-db')
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("listening on port 3000 .!");
  });
};

start();
