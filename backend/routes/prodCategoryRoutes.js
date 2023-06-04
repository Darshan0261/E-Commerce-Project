const express = require("express");
const router = express.Router();
const {
    createCategory,
    getAllCategory,
    getaCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/prodCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/", getAllCategory);
router.get("/:id", getaCategory);
router.patch("/", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
