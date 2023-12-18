import { app } from "./app";
require("dotenv").config();
import { connectDB } from "./utils/db";
app.listen(process.env.PORT, () => {
	console.log(`http://localhost:${process.env.PORT}`);
	connectDB();
});
