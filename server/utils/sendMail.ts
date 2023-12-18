import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
require("dotenv").config();
interface IEmailOptions {
	email: string;
	subject: string;
	templete: string;
	data: { [key: string]: any };
}

export default async (options: IEmailOptions): Promise<void> => {
	const transporter: Transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT || "587"),
		service: process.env.SMTP_SERVICE,
		auth: {
			user: process.env.SMTP_MAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	});
	const { email, subject, templete, data } = options;

	// get the dpath to email templete file
	const templetePath = path.join(__dirname, "..", "mails", templete);

	// render email templete with ejs
	const html = await ejs.renderFile(templetePath, data);

	const mailOptions = {
		from: process.env.SMTP_MAIL,
		to: email,
		subject,
		html,
	};
	await transporter.sendMail(mailOptions);
};
