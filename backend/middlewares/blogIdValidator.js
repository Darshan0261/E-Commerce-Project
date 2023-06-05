const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");

const blogIdValidator = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        const error = new Error("ID required in params.");
        next(error);
    }
    const blog = await Blog.findById(id);
    if (!blog) {
        const blog = new Error(`Blog with ${id} not found`);
        next(error);
    }
    next();
});

module.exports = blogIdValidator;
