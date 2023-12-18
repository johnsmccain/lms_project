import { Redis } from "ioredis";
require("dotenv").config();

const redisClient = () => {
	if (process.env.REDIS_URL) {
		console.log("Redis is url is ready for use!");
		return process.env.REDIS_URL;
	}
	throw new Error("Redis connection fail");
};

export const redis = new Redis(redisClient());
