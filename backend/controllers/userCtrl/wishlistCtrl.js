const User = require("../../models/userModel");
const asyncHandler = require("express-async-handler");

// Add or remove from Wishlist
const addOrRemoveFromWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    const user = await User.findById(_id);
    const isAlreadyAdded = user.wishlist.some(
        (id) => prodId.toString() === id.toString()
    );
    if (isAlreadyAdded) {
        const user = await User.findByIdAndUpdate(
            _id,
            {
                $pull: { wishlist: prodId },
            },
            { new: true }
        ).select("-password");
        return res.json({
            message: "Product Removed from wishlist",
            success: true,
            user,
        });
    } else {
        const user = await User.findByIdAndUpdate(
            _id,
            {
                $push: { wishlist: prodId },
            },
            { new: true }
        ).select("-password");
        return res.json({
            message: "Product Added to wishlist",
            success: true,
            user,
        });
    }
});

// Get a wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const { wishlist } = req.user;
    res.json(wishlist);
});

module.exports = {
    addOrRemoveFromWishlist,
    getWishlist,
};
