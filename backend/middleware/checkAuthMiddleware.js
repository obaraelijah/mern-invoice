import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// EMF used to authenticate incoming requests using JSON Web Tokens
// ensures that requests have a valid JWT in the authorization header,
// decodes the JWT, and verifies its authenticity before proceeding
const checkAuth = asyncHandler(async (req, res, next) => {
	let jwt_token;

	// Bearer sdfasdfasdfasdfsd

	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader?.startsWith("Bearer")) return res.sendStatus(401);

	if (authHeader && authHeader.startsWith("Bearer")) {
		jwt_token = authHeader.split(" ")[1];

		jwt.verify(
			jwt_token,
			process.env.JWT_ACCESS_SECRET_KEY,
			async (err, decoded) => {
				if (err) return res.sendStatus(403);

				const userId = decoded.id;
				req.user = await User.findById(userId).select("-password");//password excluded for security reasons
				req.roles = decoded.roles;
				next();
			}
		);
	}
})