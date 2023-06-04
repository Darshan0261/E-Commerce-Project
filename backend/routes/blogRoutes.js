const express = require("express");
const router = express.Router();

const {
    createBlog,
    updateBlog,
    getaBlog,
    getAllBlog,
    deleteBlog,
} = require("../controllers/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", getAllBlog);
router.get("/:id", getaBlog);
router.post("/", authMiddleware, isAdmin, createBlog);
router.patch("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
