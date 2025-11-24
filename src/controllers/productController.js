const Product = require("../models/Product");
const FileManager = require("../utils/FileManager");

const productManager = new FileManager("products.json");

async function getProducts() {
    const products = await productManager.read();
    return products.map(product => new Product(...Object.values(product)));
}

async function getProductById(id) {
    const products = await productManager.read();
    const product = products.find(p => p.id === id);
    if (!product) return null;
    return new Product(...Object.values(product));
}

async function addProduct(productData) {
    const products = await productManager.read();
    const lastProduct = products.length > 0 ? products[products.length - 1] : null;
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    const newProduct = new Product(newId, ...Object.values(productData));
    products.push(newProduct);
    await productManager.write(products);
    return newProduct;
}

async function updateProduct(id, updatedData) {
    const products = await productManager.read();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;
    products[productIndex] = { ...products[productIndex], ...updatedData };
    await productManager.write(products);
    return products[productIndex];
}

async function deleteProduct(id) {
    const products = await productManager.read();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;
    products.splice(productIndex, 1);
    await productManager.write(products);
    return true;
}

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };