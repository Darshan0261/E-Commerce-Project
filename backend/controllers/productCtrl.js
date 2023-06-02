const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoId");
const { default: slugify } = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
    const payload = req.body;
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(payload);
    res.json({
        message: "Product Added Successfully",
        success: true,
        newProduct,
    });
});

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const product = await Product.findById(id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.json(product);
});

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

const editProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    validateMongoDbId(id);
    if (payload.title) {
        payload.slug = slugify(payload.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedProduct) {
        res.status(404);
        throw new Error("Product Not Found");
    }
    res.json({
        message: "Product Updated Sucessfully",
        success: true,
        updatedProduct,
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        res.status(404);
        throw new Error("Product Not Found");
    }
    res.json({
        message: "Product Removed Sucessfully",
        success: true,
        deletedProduct,
    });
});

module.exports = {
    createProduct,
    getaProduct,
    getAllProducts,
    editProduct,
    deleteProduct,
};
