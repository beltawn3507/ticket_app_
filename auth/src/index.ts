import {app} from './app'
import mongoose from "mongoose";


const start = async () => {

   if(!process.env.JWT_KEY){
    throw new Error('JWT KEY must be defined')
   }
   if(!process.env.MONGO_URI){
    throw new Error('MONGO URI must be defined')
   }

    try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongo-db',process.env.MONGO_URI)
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("listening on port 3000 !!!!!");
  });
};

start();
