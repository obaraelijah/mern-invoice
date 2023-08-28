// error handling middleware func
const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode ? res.statusCode : 500;

	return res.status(statusCode).json({
		success: false,
		message: err.message,
		statusCode,
        // Include the stack trace if not in production environment
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
	});
};

const notFound = (req, res, next) => {
	const error = new Error(`That route does not exist - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

export { errorHandler, notFound };