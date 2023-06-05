const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getaProduct,
    editProduct,
    deleteProduct,
    addToWishlist,
    rateProduct,
    uploadImages,
} = require("../controllers/productCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
    uploadPhoto,
    productImgResize,
} = require("../middlewares/uploadImages");
const productIdValidator = require("../middlewares/productIdValidator");

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/", getAllProducts);

router.put(
    "/upload-images/:id",
    authMiddleware,
    isAdmin,
    productIdValidator,
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
);

router.put("/wishlist", authMiddleware, addToWishlist);

router.put("/rate", authMiddleware, rateProduct);

router.get("/:id", getaProduct);

router.patch("/:id", authMiddleware, isAdmin, editProduct);

router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
