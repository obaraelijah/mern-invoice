import asyncHandler from "express-async-handler";
import User from "../../models/userModel";

// $-title   Get User Profile
// $-path    GET /api/v1/user/profile
// $-auth    Private

const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const userProfile = await User.findById(userId, {
        refreshToken: 0,
		roles: 0,
		_id: 0,
    }).lean();// return plain js object instead of mongoose document

    if (!userProfile) {
        res.status(204); //no content
        throw new Error("user profile not found");
    }

    res.status(200).json({
        success: true,
        userProfile,
    });

});

export default getUserProfile;