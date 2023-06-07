const asyncHandler = require("express-async-handler");
const Cart = require("../../models/cartModel");

const getCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const cart = await Cart.findOne({ user_id: _id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart Not Found");
    }
    res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {});

module.exports = {
    getCart,
};
