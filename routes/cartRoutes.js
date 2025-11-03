const express = require("express");
const router = express.Router();
const { createCart, getCartById, addProductToCart } = require("../controllers/cartController");

router.post("/", createCart);
router.post("/:id", getCartById);
router.post("/:id/product/:pid", addProductToCart);

module.exports = router;
