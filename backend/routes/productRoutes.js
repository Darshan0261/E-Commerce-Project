const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getaProduct,
    editProduct,
    deleteProduct,
    addToWishlist,
} = require("../controllers/productCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/", getAllProducts);

router.put("/wishlist", authMiddleware, addToWishlist);

router.get("/:id", getaProduct);

router.patch("/:id", authMiddleware, isAdmin, editProduct);

router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
