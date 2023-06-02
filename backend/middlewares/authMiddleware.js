const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Blacklist = require("../models/tokenBlacklist");
require("dotenv").config();

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken;
    if (!token || !refreshToken) {
        res.status(401);
        throw new Error("Please Login to Continue");
    }
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        try {
            if (err) {
                throw new Error(err);
            }
            const id = decoded.id;
            const user = await User.findOne({ _id: id });
            const blacklist = await Blacklist.findOne({ user_id: id });
            if (blacklist.refreshTokens.some((item) => item === refreshToken)) {
                res.status(401);
                throw new Error("Login to continue: Refresh token is expired ");
            }
            if (blacklist.tokens.some((item) => item === token)) {
                res.status(401);
                throw new Error("Login to continue: Provided token is expired");
            }
            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
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
