const express = require("express");
const router = express.Router();

const {
    createBlog,
    updateBlog,
    getaBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
} = require("../controllers/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", getAllBlog);
router.get("/:id", getaBlog);
router.post("/", authMiddleware, isAdmin, createBlog);
router.patch("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

router.put("/like/:blogId", authMiddleware, likeBlog);
router.put("/dislike/:blogId", authMiddleware, dislikeBlog);

module.exports = router;
