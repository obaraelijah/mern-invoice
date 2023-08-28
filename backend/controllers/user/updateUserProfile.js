import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// $-title   Update User Profile
// $-path    PATCH /api/v1/user/profile
// $-auth    Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    
});