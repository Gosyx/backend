import express from "express";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import * as path from "path";
import { Server } from "socket.io";
import ProductManager from "./controllers/ProductManager.js";
import CartManager from "./controllers/CartManager.js";
import bodyParser from "body-parser";
import realTimeProductsTemplate from "./public/js/realTimeProducts.handlebars.js"; // Importar la plantilla

const productManager = new ProductManager();
const cartManager = new CartManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on Express port: ${PORT}`);
});

const io = new Server(server);

app.engine(
  "handlebars",
  engine({ layoutsDir: path.resolve(__dirname, "views/layouts") })
);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("index");
});
app.use(bodyParser.urlencoded({ extended: true }));
const message = [];

io.on("connection", (socket) => {
  console.log(`User ${socket.id} Connection`);

  //Nombre del usuario
  let userName = "";
  // Mesaje de Coneccion
  socket.on("userConnection", (data) => {
    userName = data.user;
    message.push({
      id: socket.id,
      info: "connection",
      name: data.user,
      message: `${data.user} Connectado`,
      date: new Date().toTimeString(),
    });
    io.sockets.emit("userConnection", message);
  });
  // Mensaje de Mesaje enviado
  socket.on("userMessage", (data) => {
    message.push({
      id: socket.id,
      info: "message",
      name: userName,
      message: data.message,
      date: new Date().toTimeString(),
    });
    io.sockets.emit("userMessage", message);
  });
  //Mensage Usuario escribiendo
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

// Ruta para la página de inicio (home)
app.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts(); // Obtener la lista de productos
    res.render("home", { pageTitle: "Página de inicio", products }); // Pasar la lista de productos a la vista
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos"); // Manejo de errores en caso de que no se puedan obtener los productos
  }
});

// Ruta para la página de chat
app.get("/chat", (req, res) => {
  res.render("chat", { pageTitle: "Chat por Websocket" });
});

// Ruta para la página de productos
app.get("/productos", async (req, res) => {
  try {
    const products = await productManager.getProducts(); // Obtener la lista de productos
    res.render("productos", { pageTitle: "Lista de productos", products }); // Pasar la lista de productos a la vista
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos"); // Manejo de errores en caso de que no se puedan obtener los productos
  }
});

// Ruta para la página de contacto
app.get("/contacto", (req, res) => {
  res.render("contacto", { pageTitle: "Contacto" });
});

// Ruta para agregar un producto al carrito
app.post("/cart/add", (req, res) => {
  // Obtener el ID del producto a agregar desde el cuerpo de la solicitud
  const productId = parseInt(req.body.productId);
  const quantity = parseInt(req.body.quantity);

  // Agregar el producto al carrito usando el CartManager
  cartManager.addProductToCart(productId, quantity);

  // Redireccionar al carrito de compras o mostrar un mensaje de éxito
  res.redirect("/cart");
});

// Ruta para mostrar el carrito de compras
app.get("/cart", (req, res) => {
  // Obtener los productos del carrito usando el CartManager
  const cartItems = cartManager.getCartItems();

  // Renderizar la vista del carrito de compras y pasar los productos del carrito
  res.render("cart", { pageTitle: "Carrito de Compras", cart: cartItems });
});
app.get("/realtimeproducts", (req, res) => {
  res.send(realTimeProductsTemplate);
});
