import { NextFunction, Request, Response } from "express";
import {
	IActivationToken,
	IActivationRequest,
} from "../controllers/interfaces";
import catchAsyncError from "../middleware/catchAsyncError";
import { IUser } from "../models/interfaces";
import jwt, { Secret } from "jsonwebtoken";
import ErrorHandler from "./errorHander";
import userModel from "../models/user.model";
require("dotenv").config();
export const creatActivationToken = (user: any): IActivationToken => {
	const activationCode = Math.floor(1000 * Math.random() * 9000).toString();
	const token = jwt.sign(
		{ user, activationCode },
		process.env.ACTIVATION_SECRET as Secret,
		{ expiresIn: "5m" }
	);
	return { token, activationCode };
};
