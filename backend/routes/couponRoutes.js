const express = require("express");

const router = express.Router();

const {
    createCoupon,
    getAllCoupon,
    getaCoupon,
    updateCoupon,
    deleteCoupon,
} = require("../controllers/coupoonCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", getAllCoupon);
router.get("/:id", getaCoupon);
router.post("/", authMiddleware, isAdmin, createCoupon);
router.patch("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
