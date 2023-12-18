import express from "express";
import { userRegistration } from "../controllers/user.controller";
import { activateUser } from "../controllers/activation.controller";
const userRoute = express.Router();

userRoute.post("/registration", userRegistration);
userRoute.post("/activation", activateUser);

export default userRoute;
