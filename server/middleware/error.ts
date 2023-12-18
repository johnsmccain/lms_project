import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHander";
export default (err: any, req: Request, res: Response, next: NextFunction) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal server error";
	// Invalid mongodb id
	if (err.name == "CastError") {
		const message = `Resource not found. Invalid: ${err.path}`;
		err = new ErrorHandler(message, 400);
	}

	// Duplicate key
	if (err.code == 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
		err = new ErrorHandler(message, 400);
	}

	// Invalid JWT
	if (err.name == "JsonWebTokenError") {
		const message = `Json web token is invalid.`;
		err = new ErrorHandler(message, 400);
	}

	// Expired JWT
	if (err.name == "TokenExpiredError") {
		const message = `Json web token has expired.`;
		err = new ErrorHandler(message, 400);
	}

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};
