const { generateToken, generateRefreshToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Blacklist = require("../models/tokenBlacklist");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validateMongoDbId = require("../utils/validateMongoId");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");

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

// Update password step - 1.
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    user.password = password;
    await user.save();
    res.json({
        message: "Password Updated Sucessfully",
        success: true,
    });
});

// Update password. Send email and get token.
const forgotPasswordToken = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new Error("Email and Password Required");
        const user = await User.findOne({ email });
        if (!user) throw new Error(`User with email: ${email} not found.`);
        const resetToken = await user.createPasswordResetToken();
        user.tempPassword = password;
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href="${req.protocol}://${req.hostname}:5000/api/user/reset-password/${resetToken}" >Click Here.</a>`;
        const data = {
            to: email,
            text: "Reset Password",
            subject: "Password Reset Link",
            html: resetURL,
        };
        await sendEmail(data);
        res.json({
            message: "Reset password email sent",
            success: true,
            token: resetToken,
        });
    } catch (error) {
        throw new Error(error);
    }
});

// Link sent to user email. Password reset handler.
const resetPassword = asyncHandler(async (req, res) => {
    let { token } = req.params;
    token = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Reset Link Expired. Please try again later");
    user.password = user.tempPassword;
    this.tempPassword = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    res.json({
        message: "Password Reset",
        success: true,
    });
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
    updatePassword,
    forgotPasswordToken,
    resetPassword,
};
