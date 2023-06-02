const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
require("dotenv").config();

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401);
        throw new Error("Please Login to Continue");
    }
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            throw new Error(err);
        }
        const id = decoded.id;
        const user = await User.findOne({ _id: id });
        req.user = user;
        next();
    });
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (user.role !== "admin") {
        res.status(401);
        throw new Error("Access Denied: Admin Routes are forbidden");
    }
    next();
});

module.exports = {
    authMiddleware,
    isAdmin,
};
