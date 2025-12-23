const Cart = require("../models/Cart");
const Product = require("../models/Product");

async function createCart(req, res) {
    try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ status: 'error', message: error.message });
    }
}

async function getCartById(req, res) {
    try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
    } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ status: 'error', message: error.message });
    }
}

async function addProductToCart(req, res) {
    try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const product = await Product.findById(pid);
    if (!product) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
    } else {cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cid).populate('products.product');
    res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ status: 'error', message: error.message });
    }
}

async function removeProductFromCart(req, res) {
    try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    const updatedCart = await Cart.findById(cid).populate('products.product');
    res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ status: 'error', message: error.message });
    }
}

async function updateCart(req, res) {
    try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findByIdAndUpdate(
        cid,
        { products },
        { new: true }
    ).populate('products.product');

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart });
    } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ status: 'error', message: error.message });
    }
}

async function updateProductQuantity(req, res) {
    try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ status: 'error', message: 'La cantidad debe ser mayor a 0' });
    }
    const cart = await Cart.findById(cid);

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cid).populate('products.product');
    res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({ status: 'error', message: error.message });
    }
}

async function clearCart(req, res) {
    try {
    const { cid } = req.params;
    const cart = await Cart.findByIdAndUpdate(
        cid,
        { products: [] },
        { new: true }
    );

    if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart });
    } catch (error) {
    console.error("Error al limpiar carrito:", error);
    res.status(500).json({ status: 'error', message: error.message });
    }
}

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart
};


/*
const cartManager = new FileManager("carts.json");

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

module.exports = { createCart, getCartById, addProductToCart };*/