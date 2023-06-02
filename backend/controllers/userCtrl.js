const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(409);
        throw new Error("User Already Registerd");
    }
    const user = await User.create(req.body);
    res.json({
        msg: "User Registered Sucessfully",
        success: true,
    });
});

module.exports = {
    createUser,
};
