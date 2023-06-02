const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Register / Signup user.
router.post("/register", createUser);

// User Login.
router.post("/login", loginUser);

// Get all users info.
router.get("/all-users", getAllUsers);

// Get new access token by passing refresh token in cookies.
router.get("/refresh-token", handleRefreshToken);

// User Logout Handler.
router.get("/logout", authMiddleware, userLogout);

// Get sepcific user info.
router.get("/:id", getUser);

// Delete specific user.
router.delete("/:id", deleteUser);

// Update User Profile.
router.patch("/edit", authMiddleware, updateUser);

// Block specific user.
router.patch("/block-user/:id", authMiddleware, isAdmin, blockUser);

// Unblock specific user.
router.patch("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
