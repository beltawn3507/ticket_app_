import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// router
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "@beltawnticket/common";

const app = express();
app.set('trust proxy',true);

app.use(json());
app.use(
  cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

// routes for this
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(errorHandler);

export {app}