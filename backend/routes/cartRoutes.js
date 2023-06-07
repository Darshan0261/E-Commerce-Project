const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { getCart } = require("../controllers/userCtrl/cartCtrl");

router.get("/", authMiddleware, getCart);

module.exports = router;
