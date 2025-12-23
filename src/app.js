const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const viewsRouter = require("./routes/viewsRouter");

const app = express();

app.engine("handlebars", engine({
    helpers: {
        multiply: function(a, b) {
            return a*b ;
        },

        calculateTotal: function(products) {
            if (!products || products.length === 0) return 0;
            return products.reduce((total, item) => {
                 return total + (item.product.price * item.quantity);
                }, 0).toFixed(2);
        },

        eq: function(a, b) {
        return a === b;
        }
    }
}));


app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", viewsRouter);

app.use((err, req, res, next) => {
    console.error("Error no capturado:", err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
    });
});

app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

module.exports = app;