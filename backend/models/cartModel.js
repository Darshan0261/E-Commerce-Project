const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                },
                count: Number,
                color: String,
                price: Number,
            },
        ],
        cartTotal: Number,
        totalAfterDiscount: Number,
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
