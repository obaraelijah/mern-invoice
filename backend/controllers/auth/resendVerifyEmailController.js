import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

const { randomBytes } = await import("crypto");

const domainURL = process.env.DOMAIN;

// $-title   Resend Email Verification Tokens
// $-path    POST /api/v1/auth/resend_email_token
// $-auth    Public

const resendEmailVerificationToken = asyncHandler(async (req, res) => {
    
});
