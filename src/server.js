require('dotenv').config();
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const Products = require("./models/Product");


const PORT =process.env.PORT || 8080;

connectDB();

const server = http.createServer(app);
const io = new  Server(server);

app.set("io", io);

io.on("connection", async (socket) => {
    try{
        console.log("Nuevo cliente conectado");

        const products = await Product.find().lean();
        socket.emit("updateProducts", products);
    } catch (error) {
        console.error("Error al conectar cliente:", error);
        socket.emit("error", { message: "Error al cargar productos" });
    }
    

    /*const products = await getProducts();
    socket.emit("updateProducts", products);
    */

    socket.on("createProduct", async (productData) =>{
        try{
            const newProduct = new Product(productData);
            await newProduct.save();

            const products = await Product.find().lean();
            io.emit("updateProducts", products);
            console.log("Producto creado:", newProduct);
        } catch (error) {
            console.error("Error al crear producto:", error);
            socket.emit("error", { message: "Error al crear producto: " + error.message });
        }
    });
        /*
        const { addProduct } = require("./controllers/productController");
        const newProduct = await addProduct(productData);
        const products = await getProducts();
        io.emit("updateProducts", products);*/

        socket.on("deleteProduct", async (productId) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
            
            if (!deletedProduct) {
                socket.emit("error", { message: "Producto no encontrado" });
                return;
            }

            const products = await Product.find().lean();
            io.emit("updateProducts", products);
            
            console.log("Producto eliminado:", deletedProduct);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            socket.emit("error", { message: "Error al eliminar producto: " + error.message });
        }
    });

    /*
    socket.on("deleteproduct", async (productId) => {
        const { deleteProduct } =
        require("./controllers/productController")
        await deleteProduct(parseInt(productId));
        const products = await getProducts();
        io.emit("updateProducts", products);
    });*/

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

