const express = require("express");
const router = express.Router();
const {
    createCategory,
    getAllCategory,
    getaCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/blogCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/", getAllCategory);
router.get("/:id", getaCategory);
router.patch("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
