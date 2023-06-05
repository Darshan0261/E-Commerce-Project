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
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    addToWishlist,
    getWishlist,
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

// Get a Wishlist
router.get("/wishlist", authMiddleware, getWishlist);

// Add product to Wishlist
router.put("/wishlist", authMiddleware, addToWishlist);

// Get sepcific user info.
router.get("/:id", getUser);

// Delete specific user.
router.delete("/:id", deleteUser);

// Update User Profile.
router.patch("/edit", authMiddleware, updateUser);

// Update User Password
router.patch("/password", authMiddleware, updatePassword);

// Send forgot password link to user via email and get token.
router.post("/forgot-password-token", forgotPasswordToken);

// Sent link - reset password
router.get("/reset-password/:token", resetPassword);

// Block specific user.
router.patch("/block-user/:id", authMiddleware, isAdmin, blockUser);

// Unblock specific user.
router.patch("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
