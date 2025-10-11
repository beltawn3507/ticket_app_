import express, { Request, Response } from "express";
import { RequestValidationError } from "@beltawnticket/common";
import { body, validationResult } from "express-validator";
import { validateRequest } from "@beltawnticket/common";
import { User } from "../models/user";
import { BadRequesterror } from "@beltawnticket/common";
import { Password } from "../services/password";
import  jwt  from 'jsonwebtoken';

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must give a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser?.email || !existingUser?.password) {
      throw new BadRequesterror("Invalid credentials");
    }

    const passswordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passswordMatch) {
      throw new BadRequesterror("Invalid credentials");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send({
      id:existingUser._id,
      email:existingUser.email
    })
  }
);

export { router as signinRouter };
