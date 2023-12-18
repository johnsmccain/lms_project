import express, { NextFunction, Request, Response } from "express";
export const app = express();
require("dotenv").config();
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleWare from "./middleware/error";
import userRoute from "./routes/user.route";

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// Cors
app.use(cors({ origin: process.env.ORIGINAL }));

// routes
app.use("/api/v1", userRoute);

// Testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: "Healthy route",
	});
});

// Unknown request
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});

app.use(errorMiddleWare);
