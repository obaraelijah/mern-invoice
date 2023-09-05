import express from "express";
import registerUser from "../controllers/auth/registerController.js";
import verifyUserEmail from "../controllers/auth/verifyEmailController.js";
import loginUser from "../controllers/auth/loginController.js";
import { loginLimiter } from "../middleware/apiLimiter.js";
import newAccessToken from "../controllers/auth/refreshTokenController.js";
import resendEmailVerificationToken from "../controllers/auth/resendVerifyEmailController.js";
import logoutUser from "../controllers/auth/logoutController.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import {
	resetPassword,
	resetPasswordRequest,
} from "../controllers/auth/passwordResetController.js";

const router = express.Router();

router.post("/register", registerUser);

router.get("/verify/:emailToken/:userId", verifyUserEmail);

router.post("/login", loginLimiter, loginUser);

router.get("/new_access_token", newAccessToken);

router.post("/resend_email_token", resendEmailVerificationToken);

router.post("/reset_password_request", resetPasswordRequest);

router.post("/reset_password", resetPassword);

router.get("/logout", logoutUser);

// route for initiating Google OAuth2.0 authentication
router.get(
	"/google",
	passport.authenticate("google", {
		session: false,  // stateless auth
		scope: ["profile", "email"],
		accessType: "offline",
		prompt: "consent", //prompts the user for their consent to access their Google account data
	})
);

// $-title   Redirect route to the passport google strategy
// $-path    GET /api/v1/auth/google/redirect

// route for handling the Google OAuth2.0 redirect/callback
router.get(
	"/google/redirect",
	passport.authenticate("google", {
	  failureRedirect: "/login", 
	  session: false, 
	}),
	async (req, res) => {
	  const existingUser = await User.findById(req.user.id);
  
	  const payload = {
		id: req.user.id,
		roles: existingUser.roles,
		firstName: existingUser.firstName,
		lastName: existingUser.lastName,
		username: existingUser.username,
		provider: existingUser.provider,
		avatar: existingUser.avatar,
	  };
  
	  // Generate JWT token
	  jwt.sign(
		payload,
		process.env.JWT_ACCESS_SECRET_KEY,
		{ expiresIn: "20m" },
		(err, token) => {
		  // Convert the JWT token to a string
		  const jwtToken = `${token}`;
  
		  // Create an HTML response that stores the JWT in localStorage and redirects to /dashboard
		  const embedJWT = `
			<html>
			  <script>
				window.localStorage.setItem("googleToken", '${jwtToken}')
				window.location.href = '/dashboard'
			  </script>
			</html>
		  `;
		  
		  // Sends the HTML response to the client
		  res.send(embedJWT);
		}
	  );
	}
  );
  
  export default router;