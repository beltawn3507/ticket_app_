import express from 'express'
import 'express-async-errors'
import {json} from 'body-parser'

// router 
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error-handler';

const app=express();
app.use(json());

// routes for this
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(errorHandler);


app.listen(3000,()=>{
    console.log("listening on port 3000 .!")
});


