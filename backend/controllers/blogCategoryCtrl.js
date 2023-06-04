const Category = require("../models/blogCategoryModel");

const asyncHandler = require("express-async-handler");

const validateMongoDbId = require("../utils/validateMongoId");

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error("Title is required.");
    }
    const category = await Category.create({ title });
    res.json({
        message: "New Category Added",
        success: true,
        category,
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error("Title is required.");
    }
    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { title },
        { new: true }
    );
    if (!updatedCategory) {
        res.status(404);
        throw new Error("Category Not Found");
    }
    res.json({
        message: "Category Updated",
        success: true,
        updateCategory,
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
        res.status(404);
        throw new Error("Category Not Found");
    }
    res.json({
        message: "Category Deleted",
        success: true,
        deletedCategory,
    });
});

const getaCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const category = await Category.findById(id);
    if (!category) {
        res.status(404);
        throw new Error("Category Not Found");
    }
    res.json(category);
});

const getAllCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getaCategory,
    getAllCategory,
};
