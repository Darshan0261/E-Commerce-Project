const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        index: true,
        uppercase: true,
    },
    discountPercent: {
        type: Number,
        min: 0,
        max: 100,
    },
    discountAmount: {
        type: Number,
        min: 0,
    },
    expiry: {
        type: Date,
        required: true,
        min: Date.now(),
    },
});

couponSchema.pre("save", function (next) {
    if (!this.isNew) {
        // Skip the pre-hook logic for updates
        return next();
    }
    this.discountPercent = this.discountPercent || 0;
    this.discountInRupees = this.discountInRupees || 0;
    this.expiry = this.expiry || Date.now();
    next();
});

const couponModel = mongoose.model("Coupon", couponSchema);

module.exports = couponModel;
