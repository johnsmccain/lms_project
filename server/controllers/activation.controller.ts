import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import { IActivationRequest } from "./interfaces";
import { IUser } from "../models/interfaces";
import jwt, { Secret } from "jsonwebtoken";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/errorHander";
require("dotenv").config();

export const activateUser = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		const {
			activationToken,
			activationCode,
		}: { activationCode: string; activationToken: string } =
			req.body as IActivationRequest;

		const newUser: { user: IUser; activationCode: string } = jwt.verify(
			activationToken,
			process.env.ACTIVATION_SECRET as string
		) as {
			user: IUser;
			activationCode: string;
		};
		if (newUser.activationCode != activationCode) {
			return next(new ErrorHandler("Invalid activation code!", 400));
		}

		const { name, email, password } = newUser.user;

		const userExist = await userModel.find({ email });
		if (userExist.length) {
			return next(new ErrorHandler("This user is registered already!", 400));
		}
		console.log({ name, email, password });
		const user = await userModel.create({
			name,
			email,
			password,
		});

		res.status(201).json("New user is created successfuly,");
	}
);
