const { error } = require("console");
const Product = require("../models/Product");
const FileManager = require("../utils/FileManager");

const productManager = new FileManager("products.json");

async function getProducts() {
    const products = await productManager.read();
    return products.map(product => new Product(...Object.values(product)));
}

async function getProductById(req, res) {
    const products = await productManager.read();
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (!product) return null;
    return res.status(404).json({ error: "Producto no encontrado" });
}

async function addProduct(productData) {
    const products = await productManager.read();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
    id: newId,
    title: productData.title,
    description: productData.description,
    code: productData.code,
    price: productData.price,
    status: productData.status !== undefined ? productData.status : true,
    stock: productData.stock,
    category: productData.category,
    thumbnails: productData.thumbnails || []
    };

    products.push(newProduct);
    await productManager.write(products);
    return newProduct;
}

async function addProductHTTP(req, res) {
    try {
    const newProduct = await addProduct(req.body);

    const io = req.app.get("io");
    if (io) {
        const products = await getProducts();
        io.emit("updateProducts", products);
    }
    
    res.status(201).json(newProduct);
    } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
    }
}

async function updateProduct(req, res) {
    const products = await productManager.read();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));

    if (productIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    } 

    const { id, ...updateData } = req.body;
    products[productIndex] = { ...products[productIndex], ...updateData };
    await productManager.write(products);

    const io = req.app.get("io");
    if (io) {
    const updatedProducts = await getProducts();
    io.emit("updateProducts", updatedProducts);
    }

    res.json(products[productIndex]);
}

async function deleteProduct(productId) {
    const products = await productManager.read();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return null;
    }

    products.splice(productIndex, 1);
    await productManager.write(products);
    return true;
}

async function deleteProductHTTP(req, res) {
    try {
    const result = await deleteProduct(parseInt(req.params.pid));
    
    if (!result) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    const io = req.app.get("io");
    if (io) {
        const products = await getProducts();
        io.emit("updateProducts", products);
    }
    
    res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
    }
}

module.exports = { getProducts, getProductById, addProduct,addProductHTTP, updateProduct, deleteProduct,deleteProductHTTP };