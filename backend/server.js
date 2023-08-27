import chalk from "chalk";
import path from "path";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import mongosanitize from "express-mongo-sanitize"
import connectionToDB from "./config/connectDB.js";
import morgan from "morgan";
import { morganMiddleware, systemLogs } from "./utils/Logger.js";
import { validateHeaderValue } from "http";

await connectionToDB();

const app = express();


if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(mongosanitize());

app.use(morganMiddleware);

app.get("/api/v1/test", (req, res) => {
    res.json({ Hi: "Welcome to the Invoice App" });
});


app.listen(PORT, () => {
	console.log(
		`${chalk.green.bold("✔")} 👍 Server running in ${chalk.yellow.bold(
			process.env.NODE_ENV
		)} mode on port ${chalk.blue.bold(PORT)}`
	);
	systemLogs.info(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	);
});