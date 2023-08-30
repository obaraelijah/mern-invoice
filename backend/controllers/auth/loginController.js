import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import { systemLogs } from "../../utils/Logger.js";

// $-title   Login User, get access and refresh tokens
// $-path    POST /api/v1/auth/login
// $-auth    Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  // Find the user by their email and include the password
  const existingUser = await User.findOne({ email }).select("+password");

  // Check if user exists and compare the provided password with password stored in db
  if (!existingUser || !(await existingUser.comparePassword(password))) {
    res.status(401);
    systemLogs.error("incorrect email or password");
    throw new Error("Incorrect email or password");
  }

  // Check if user's email is verified
  if (!existingUser.isEmailVerified) {
    res.status(400);
    throw new Error(
      "You are not verified. Check your email, a verification email link was sent when you registered"
    );
  }

  // Check if user account is active
  if (!existingUser.active) {
    res.status(400);
    throw new Error(
      "You have been deactivated by the admin and login is impossible. Contact us for enquiries"
    );
  }

  // If user is verified and active, generate access and refresh tokens
  if (existingUser && (await existingUser.comparePassword(password))) {
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        roles: existingUser.roles,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "10m" }
    );

    const newRefreshToken = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const cookies = req.cookies;

    // Check if there's a JWT cookie
    let newRefreshTokenArray = !cookies?.jwt
      ? existingUser.refreshToken
      : existingUser.refreshToken.filter((refT) => refT !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      // Check if the existing refresh token is valid
      const existingRefreshToken = await User.findOne({
        refreshToken,
      }).exec();

      // If the existing refresh token is invalid, clear the cookie
      if (!existingRefreshToken) {
        newRefreshTokenArray = [];
      }

      // Clear the refresh token cookie
      const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "None",
      };
      res.clearCookie("jwt", options);
    }

    // Update user's refresh token array and save
    existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await existingUser.save();

    // Set new refresh token cookie
    const options = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    };
    res.cookie("jwt", newRefreshToken, options);

    res.json({
      success: true,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      username: existingUser.username,
      provider: existingUser.provider,
      avatar: existingUser.avatar,
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials provided");
  }
});

export default loginUser;
