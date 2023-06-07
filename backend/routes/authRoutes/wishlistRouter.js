const express = require("express");

const router = express.Router();

const {
    addOrRemoveFromWishlist,
    getWishlist,
} = require("../../controllers/userCtrl/wishlistCtrl");

const { authMiddleware } = require("../../middlewares/authMiddleware");

// Get a Wishlist
router.get("/", authMiddleware, getWishlist);

// Add product to Wishlist
router.put("/", authMiddleware, addOrRemoveFromWishlist);

module.exports = router;
