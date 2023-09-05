import chalk from "chalk";
import path from "path";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import connectionToDB from "./config/connectDB.js";
import { morganMiddleware, systemLogs } from "./utils/Logger.js";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { apiLimiter } from "./middleware/apiLimiter.js";
import passport from "passport";
import googleAuth from "./config/passportSetup.js";
import customerRoutes from "./routes/customerRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

await connectionToDB();

const app = express();

const __dirname = path.resolve(); // Get the current directory's absolute path

// Serve files from the "/uploads" directory at the "/uploads" route
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Serve files from the "/docs" directory at the "/docs" route
app.use("/docs", express.static(path.join(__dirname, "/docs")));


if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
googleAuth();

app.use(cookieParser());

app.use(mongosanitize());

app.use(morganMiddleware);

app.get("/api/v1/test", (req, res) => {
    res.json({ Hi: "Welcome to the Invoice App" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", apiLimiter, userRoutes);
app.use("/api/v1/customer", apiLimiter, customerRoutes);
app.use("/api/v1/document", apiLimiter, documentRoutes);
app.use("/api/v1/upload", apiLimiter, uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1997;

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