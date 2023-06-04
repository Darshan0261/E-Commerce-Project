const Product = require("../models/productModel");
const User = require("../models/userModel");
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
    // Filtering
    let queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    // Selecting Fields
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
    } else {
        query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    if (req.query.page) {
        const productsCount = await Product.countDocuments();
        if (skip >= productCount) {
            throw new Error("This page does not exists");
        }
    }

    query = query.skip(skip).limit(limit);

    const products = await query;
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

const addToWishlist = asyncHandler(async (req, res) => {
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

module.exports = {
    createProduct,
    getaProduct,
    getAllProducts,
    editProduct,
    deleteProduct,
    addToWishlist,
};
