const app = require("/app");
const http = require("http");
const { Server } = require("socket.io");
const { getProducts } = require("./controllers/productController");
const { Socket } = require("dgram");

const PORT = 8080;
const Server = http.createServer(app);
const io = new  Server(server);

app.set("io", io);

io.on("connection", async (Socket) => {
    console.log("Nuevo cliente conectado");

    const products = await getProducts();
    socket.emit("updateProducts", products);

    socket.on("createProduct", async (productData) =>{
        const { addProduct } = require("./controllers/productController");
        const newProduct = await addProduct(productData);
        const products = await getProducts();
        io.emit("updateProducts", products);
    });

    socket.on("deleteproduct", async (productId) => {
        const { deleteProduct } =
        require("./controllers/productController")
        await deleteProduct(parseInt(productId));
        const products = await getProducts();
        io.emit("updateProducts", products);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

server.listen(PORT, () => {
    console.log("Server runnitg on http://localhost:{PORT}");
});