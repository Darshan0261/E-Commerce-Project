const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    author: {
        type: String,
        default: "Admin",
    },
});

const BlogModel = mongoose.model("blog", blogSchema);

module.exports = BlogModel;
