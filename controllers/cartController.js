const Cart = require("../models/Cart");
const FileManager = require("../utils/FileManager");

const cartManager = new FileManager("carts.JSON");

async function createCart() {
    const carts = await cartManager.read();
    const lastCart = carts.length > 0 ? carts[carts.length - 1] : null;
    const newId = lastCart ? lastCart.id + 1 : 1;
    const newCart = new Cart(newId, []);
    carts.push(newCart);
    await cartManager.write(carts);
    return newCart;
}

async function getCartById(id) {
    const carts = await cartManager.read();
    const cart = carts.find(c => c.id === id);
    if (!cart) return null;
    return new Cart(...Object.values(cart));
}

async function addProductToCart(cid, pid) {
    const carts = await cartManager.read();
    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex === -1) return null;
    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
    cart.products.push({ id: pid, quantity: 1 });
    } else {
        cart.products[productIndex].quantity += 1;
    }
    await cartManager.write(carts);
    return cart;
}

module.exports = { createCart, getCartById, addProductToCart };