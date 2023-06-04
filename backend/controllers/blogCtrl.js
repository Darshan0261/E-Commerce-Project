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
    const blog = await Blog.findById(id)
        .populate({ path: "likes", select: "-password" })
        .populate({ path: "dislikes", select: "-password" });
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

const likeBlog = asyncHandler(async (req, res) => {
    const loginUserId = req.user._id;
    const { blogId } = req.params;
    validateMongoDbId(blogId);
    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not Found");
    }
    const alreadyDisliked = blog.dislikes.some(
        (id) => loginUserId.toString() === id.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                $push: { likes: loginUserId },
            },
            { new: true }
        );
        return res.json({
            message: "Post Liked",
            success: true,
            blog,
        });
    }
    const alreadyLiked = blog.likes.some(
        (id) => loginUserId.toString() === id.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
            },
            { new: true }
        );
        res.json({
            message: "Post Like Removed",
            success: true,
            blog,
        });
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
            },
            { new: true }
        );
        res.json({
            message: "Post Liked",
            success: true,
            blog,
        });
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const loginUserId = req.user._id;
    const { blogId } = req.params;
    validateMongoDbId(blogId);
    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not Found");
    }
    const alreadyLiked = blog.likes.some(
        (id) => loginUserId.toString() === id.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                $push: { dislikes: loginUserId },
            },
            { new: true }
        );
        return res.json({
            message: "Post Disliked",
            success: true,
            blog,
        });
    }
    const alreadyDisliked = blog.dislikes.some(
        (id) => loginUserId.toString() === id.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
            },
            { new: true }
        );
        res.json({
            message: "Post Disliked Removed",
            success: true,
            blog,
        });
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
            },
            { new: true }
        );
        res.json({
            message: "Post Disliked",
            success: true,
            blog,
        });
    }
});

module.exports = {
    createBlog,
    updateBlog,
    getaBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
};
