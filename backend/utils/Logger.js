import morgan from "morgan";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, prettyPrint } = format;

const fileRotateTransport = new transports.DailyRotateFile({
	filename: "logs/combined-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	maxFiles: "14d",
});


export const systemLogs = createLogger({
	level: "http",
	format: combine(
		timestamp({
			format: "YYYY-MM-DD hh:mm:ss.SSS A",
		}),
		prettyPrint()
	),
	transports: [
		fileRotateTransport,
		new transports.File({
			level: "error",
			filename: "logs/error.log",
		}),
	],
	exceptionHandlers: [
		new transports.File({ filename: "logs/exception.log" }),
	],
	rejectionHandlers: [
		new transports.File({ filename: "logs/rejections.log" }),
	],
});