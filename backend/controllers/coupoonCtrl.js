const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoId");

const createCoupon = asyncHandler(async (req, res) => {
    const payload = req.body;
    const coupon = await Coupon.create(payload);
    res.json({
        message: "Coupon Created Sucessfully",
        success: true,
        coupon,
    });
});

const getaCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        res.status(404);
        throw new Error("Coupon not found");
    }
    res.json(coupon);
});

const getAllCoupon = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    res.json(coupons);
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const payload = req.body;
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedCoupon) {
        res.status(404);
        throw new Error("Coupon not found");
    }
    res.json({
        message: "Coupon Updated Sucessfully",
        success: true,
        updatedCoupon,
    });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const deletedCoupon = await Coupon.findByIdAndDelete(id, { new: true });
    if (!deletedCoupon) {
        res.status(404);
        throw new Error("Coupon not found");
    }
    res.json({
        message: "Coupon Deleted Sucessfully",
        success: true,
        deletedCoupon,
    });
});

module.exports = {
    createCoupon,
    getaCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
};
