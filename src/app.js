const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const viewsRouter = require("./routes/viewsRouter");

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", viewsRouter);

module.exports = app;