import chalk from "chalk";
import path from "path";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import mongosanitize from "express-mongo-sanitize"
import connectionToDB from "./config/connectDB.js";

connectionToDB()

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(mongosanitize());

app.get("/api/v1/test", (req, res) => {
    res.json({ Hi: "Welcome to the Invoice App" });
});


const PORT = process.env.PORT || 1997;

app.listen(PORT, () => {
    console.log(
        `${chalk.green.bold("✔")} 👍 Server running in ${chalk.yellow.bold(
            process.env.NODE_ENV
        )} mode on port ${chalk.blue.bold(PORT)}`
    );
});