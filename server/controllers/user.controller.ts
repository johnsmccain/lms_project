import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/errorHander";
import { ILogInRequest, IRegistration } from "./interfaces";
import { creatActivationToken } from "../utils/token";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

export const userRegistration = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { name, email, password } = req.body;

			const userExist = await userModel.find({ email });
			console.log(userExist);
			// if (userExist.length > 0) {
			if (userExist.length > 0) {
				return next(new ErrorHandler("Email already exist", 400));
			}

			const user: IRegistration = {
				name,
				email,
				password,
			};
			const activationToken = creatActivationToken(user);
			const activationCode = activationToken.activationCode;
			const data = { user: { name: user.name }, activationCode };
			const filePath = path.join(
				__dirname,
				"..",
				"mails",
				"activationMail.ejs"
			);
			const html = await ejs.renderFile(filePath, data);
			// console.log(html);
			try {
				console.log(data);
				// await sendMail({
				// 	email: user.email,
				// 	subject: "Activate your account",
				// 	templete: "activationMail.ejs",
				// 	data,
				// });

				res.status(200).json({
					success: true,
					message: `Please check your email: ${user.email} to activate your account`,
					activationToken: activationToken.token,
					users: await userModel.find(),
				});
			} catch (error: any) {
				next(new ErrorHandler(error.message, 400));
			}
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// Login Request
export const userLogin = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body as ILogInRequest;

			if (!email || !password) {
				return next(
					new ErrorHandler("Please provide your email and password", 400)
				);
			}
			const user = await userModel.find({ email }).select("+password");
			if (!user) {
				return next(new ErrorHandler("Please provide a valid email", 400));
			}

			const isUserPasswordMatch = await user.comparePassword(password);

			if (!isUserPasswordMatch) {
				return next(new ErrorHandler("Invalid email or password", 400));
			}
		} catch (error: any) {
			return next(new ErrorHandler(error.mesage, 400));
		}
	}
);
