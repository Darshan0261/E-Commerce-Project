const { generateToken, generateRefreshToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Blacklist = require("../models/tokenBlacklist");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validateMongoDbId = require("../utils/validateMongoId");

// Create a new User.
const createUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(409);
        throw new Error("User Already Registerd");
    }
    const user = await User.create(req.body);
    const blacklist = await Blacklist.create({ user_id: user._id });
    res.status(201);
    res.json({
        msg: "User Registered Sucessfully",
        success: true,
    });
});

// Login User.
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Email and Password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User Not Registered");
    }
    if (!(await user.isPasswordMatch(password))) {
        res.status(401);
        throw new Error("Wrong Credentials");
    }
    const refreshToken = generateRefreshToken(user._id);
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            refreshToken,
        },
        { httpOnlyu: true, maxAge: 72 * 60 * 60 * 1000 }
    );
    res.cookie("refreshToken", refreshToken);
    res.json({
        message: "User Login Sucessful",
        sucess: true,
        userInfo: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            email: user.email,
        },
        token: generateToken(user._id),
    });
});

// Get all users info. Except password.
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([{ $project: { password: 0 } }]);
    res.send(users);
});

// Update User Profile. Login required.
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const updatedUserInfo = req.body;
    if (updatedUserInfo.password) {
        res.status(403);
        throw new Error("Password update not allowed");
    }
    const updatedUser = await User.findByIdAndUpdate(_id, updatedUserInfo, {
        new: true,
    });
    if (!updatedUser) {
        res.status(404);
        throw new Error("User Not Found");
    }
    res.json({
        message: "User Info Updated",
        success: true,
    });
});

// Get specific user info. Except password.
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const user = await User.findOne({ _id: id });
    if (!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const { password, ...userInfo } = user._doc;
    res.send(userInfo);
});

// Delete specific user.
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        res.status(404);
        throw new Error("User Not Found");
    }
    res.status(204);
    res.send(deletedUser);
});

// Block user. Admin login required.
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const user = await User.findOne({ _id: id });
    if (!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    user.isBlocked = true;
    await user.save();
    res.json({
        message: "Usere Blocked Sucessfully",
        sucess: true,
    });
});

// Unblock user. Admin login required.
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const user = await User.findOne({ _id: id });
    if (!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    user.isBlocked = false;
    await user.save();
    res.json({
        message: "Usere Blocked Sucessfully",
        sucess: true,
    });
});

// Get a new token with refresh token.
const handleRefreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        res.status(401);
        throw new Error(
            "Login to continue: Refresh token not found in cookies"
        );
    }
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new Error("No refresh token present in DB or not matched.");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, function (err, decoded) {
        if (err || user._id !== decoded.id) {
            throw new Error("There is something wrong with refresh token.");
        }
        const accessToken = generateToken(user._id);
        res.json({
            message: "Access Token Granted",
            success: true,
            accessToken,
        });
    });
});

// User logout handler
const userLogout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    const token = req.headers.authorization.split(" ")[1];
    const blacklist = await Blacklist.findOne({ user_id: user._id });
    blacklist.token.push(token);
    blacklist.refreshToken.push(refreshToken);
    await User.findOneAndUpdate(updateToken, {
        updateToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204);
});

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    userLogout,
};
