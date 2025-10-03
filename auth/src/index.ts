import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

// router
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.set('trust proxy',true);

app.use(json());
app.use(
  cookieSession({
    signed:false,
    secure: true
  })
)

// routes for this
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(errorHandler);

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
