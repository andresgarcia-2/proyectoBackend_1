const express = require("express");
const router = express.Router();
const { createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart } = require("../controllers/cartController");

router.post("/", createCart);
router.post("/:Cid", getCartById);
router.post("/:Cid/product/:pid", addProductToCart);
router.delete("/:cid/products/:pid", removeProductFromCart);
router.put("/:cid", updateCart);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid", clearCart);

module.exports = router;
