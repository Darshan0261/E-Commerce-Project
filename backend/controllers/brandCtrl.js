const Brand = require("../models/brandModel");

const asyncHandler = require("express-async-handler");

const validateMongoDbId = require("../utils/validateMongoId");

const createBrand = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error("Title is required.");
    }
    const brand = await Brand.create({ title });
    res.json({
        message: "New Brand Added",
        success: true,
        brand,
    });
});

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error("Title is required.");
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        { title },
        { new: true }
    );
    if (!updatedBrand) {
        res.status(404);
        throw new Error("Brand Not Found");
    }
    res.json({
        message: "Brand Updated",
        success: true,
        updateBrand,
    });
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
        res.status(404);
        throw new Error("Brand Not Found");
    }
    res.json({
        message: "Brand Deleted",
        success: true,
        deletedBrand,
    });
});

const getaBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Brand.findById(id);
    if (!brand) {
        res.status(404);
        throw new Error("Brand Not Found");
    }
    res.json(brand);
});

const getAllBrand = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    res.json(brands);
});

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getaBrand,
    getAllBrand,
};
