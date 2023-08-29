import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// $-title   Get All Users
// $-path    GET /api/v1/user/all
// $-auth    Private/Admin

const getAllUserAccounts = asyncHandler(async (req, res) => {
    const pageSize = 10;

    const page = Number(req.query.pageNumber) || 1;

    //count for no. of user doc in db
    const count = await User.countDocuments({});
    
    // Retrieve users with pagination and sort by creation date
    const users = await User.find()
        .sort({ createdAt: -1 })
        .select("-refreshToken")
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .lean(); //convert the results into plain JavaScript objects

        res.json({
            success: true,
            count,
            numberOfPages: Math.ceil(count / pageSize),
            users,
        });
});

export default getAllUserAccounts;