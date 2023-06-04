const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const validateMongoDbId = require("../utils/validateMongoId");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
    const payload = req.body;
    const blog = await Blog.create(payload);
    res.json({
        message: "Blog Posted Successfully",
        success: true,
        blog,
    });
});

const getaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
        res.status(404);
        throw new Error("Blog Not Found");
    }
    blog.numViews++;
    await blog.save();
    res.json(blog);
});

const getAllBlog = asyncHandler(async (req, res) => {
    const blogs = await Blog.find();
    res.json(blogs);
});

const updateBlog = asyncHandler(async (req, res) => {
    const payload = req.body;
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, payload);
    if (!updateBlog) {
        res.status(404);
        throw new Error("Blog Not Found");
    }
    res.json({
        message: "Blog Updated Sucessfully",
        success: true,
        updateBlog,
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndUpdate(id);
    if (!deletedBlog) {
        res.status(404);
        throw new Error("Blog Not Found");
    }
    res.json({
        message: "Blog Deleted Sucessfully",
        success: true,
        deletedBlog,
    });
});

module.exports = {
    createBlog,
    updateBlog,
    getaBlog,
    getAllBlog,
    deleteBlog,
};
