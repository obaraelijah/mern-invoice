import rateLimit from "express-rate-limit";
import { systemLogs } from "../utils/Logger.js"

//apilimiter middleware
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes(Time frame for which requests are checked)
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: {
        message:
        "Too many requests from this IP address, please try again after 15 minmutes",
    },
    handler: (req, res, next, options) => {
		systemLogs.error(
			`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
		);
		res.status(options.statusCode).send(options.message);//429 status code for too many reqs
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const loginLimiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	max: 20,
	message: {
		message:
			"Too many login attempts from this IP address, please try again after 30 minutes",
	},
	handler: (req, res, next, options) => {
		systemLogs.error(
			`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
		);
		res.status(options.statusCode).send(options.message);
	},
	standardHeaders: true,
	legacyHeaders: false,
});