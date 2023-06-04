const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        star: { type: Number, min: 0, max: 5 },
        comment: String,
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    },
    { _id: false }
);

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        sold: {
            type: Number,
            default: 0,
        },
        images: Array,
        ratings: [ratingSchema],
        totalRating: {
            type: String,
            default: 0,
        },
    },
    { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
