const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");

router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = {};
    if (query) {
        if (query === 'available') {
            filter.status = true;
        } else {
            filter.category = query;
        }
    }

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true
    };

    if (sort) {
        options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    const result = await Product.paginate(filter, options);

    const baseUrl = '/products';
    const buildLink = (pageNum) => {
        const params = new URLSearchParams({
            limit,
            page: pageNum,
            ...(sort && { sort }),
            ...(query && { query })
        });
        return `${baseUrl}?${params.toString()}`;
    };

    res.render('products', {
        products: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });
    } catch (error) {
        console.error("Error al cargar productos:", error);
        res.status(500).render('error', { message: 'Error al cargar productos' });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }
        res.render('productDetail', { product });
    } catch (error) {
        console.error("Error al cargar producto:", error);
        res.status(500).render('error', { message: 'Error al cargar producto' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }
        res.render('cart', { cart });
    } catch (error) {
        console.error("Error al cargar carrito:", error);
        res.status(500).render('error', { message: 'Error al cargar carrito' });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error("Error al cargar productos en tiempo real:", error);
        res.status(500).render('error', { message: 'Error al cargar productos' });
    }
});

router.get('/', (req, res) => {
    res.redirect('/products');
});

module.exports = router;