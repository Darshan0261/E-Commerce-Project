const { default: mongoose } = require("mongoose");
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoId");

const createUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(409);
        throw new Error("User Already Registerd");
    }
    const user = await User.create(req.body);
    res.status(201);
    res.json({
        msg: "User Registered Sucessfully",
        success: true,
    });
});

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

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([{ $project: { password: 0 } }]);
    res.send(users);
});

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

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
};
