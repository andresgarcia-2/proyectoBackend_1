const express = require("express");
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    addProductHTTP, 
    updateProduct, 
    deleteProductHTTP 
} = require("../controllers/productController");

router.get("/", async (req, res) => {
    const products = await getProducts();
    res.json(products);
});

router.get("/:pid", getProductById);
router.post("/", addProductHTTP);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProductHTTP);

module.exports = router;