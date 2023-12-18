import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./interfaces";
import bcrypt from "bcryptjs";
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.@[^\s@]+s/;
import jwt from "jsonwebtoken";
const userSchema: Schema<IUser> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name"],
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
			unique: true,
			// validate: {
			// 	validator: function (value: any) {
			// 		return emailRegexPattern.test(value);
			// 	},
			// 	message: "Please enter a valid email",
			// },
		},
		password: {
			type: String,
			required: [true, "Please enter your password"],
			minlength: [6, "Password must be at least 6 characters"],
			select: false,
		},
		avatar: {
			public_id: String,
			url: String,
		},
		role: {
			type: String,
			default: "user",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		courses: [{ courseId: String }],
	},
	{ timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next: any) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});
// Sign access token
userSchema.methods.SignAccessToken = function () {
	jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "");
};
// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
	jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "");
};
// compare password
userSchema.methods.comparePassword = async function (
	enteredPassword: string
): Promise<Boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
