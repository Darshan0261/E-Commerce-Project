const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const productIdValidator = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        const error = new Error("ID required in params.");
        next(error);
    }
    const product = await Product.findById(id);
    if (!product) {
        const error = new Error(`Product with ${id} not found`);
        next(error);
    }
    next();
});

module.exports = productIdValidator;
