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
    uploadImages,
} = require("../controllers/blogCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const blogIdValidator = require("../middlewares/blogIdValidator");
const { uploadPhoto } = require("../middlewares/uploadImages");

router.get("/", getAllBlog);
router.get("/:id", getaBlog);
router.post("/", authMiddleware, isAdmin, createBlog);
router.patch("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

router.put(
    "/upload-images/:id",
    authMiddleware,
    isAdmin,
    blogIdValidator,
    uploadPhoto.array("images", 2),
    uploadImages
);

router.put("/like/:blogId", authMiddleware, likeBlog);
router.put("/dislike/:blogId", authMiddleware, dislikeBlog);

module.exports = router;
