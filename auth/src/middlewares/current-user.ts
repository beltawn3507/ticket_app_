import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// we declare thi to tell typescript to add a currentuser property to the req
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// middleware that checks if there is any valid jwt token in cookie and then set the req.currentuser to that payload
// we will get the loggedin user info from this middleware

// if user logged in then req.currentuser = user details
// else null

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt,process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}
  next();
};
