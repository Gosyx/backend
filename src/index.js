import express from "express";
import exphbs from "express-handlebars";
import viewRouter from "./routes/view.router.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import { fileURLToPath } from "url";
import * as path from "path";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import ProductManager from "./dao/mongomanagers/productManagerMongo.js"; // Asegúrate de importar el ProductManager

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8080;

// Asegúrate de importar el ProductManager
const manager = new ProductManager();

const server = app.listen(PORT, () => {
  console.log(`Server running on Express port: ${PORT}`);
});

const io = new Server(server);

const handlebars = exphbs.create();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "views"));

app.use("/", viewRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const message = [];

io.on("connection", (socket) => {
  console.log(`User ${socket.id} Connection`);

  let userName = "";

  socket.on("userConnection", (data) => {
    userName = data.user;
    const connectionMessage = {
      id: socket.id,
      info: "connection",
      name: data.user,
      message: `${data.user} Conectado`,
      date: new Date().toTimeString(),
    };
    message.push(connectionMessage);
    io.sockets.emit("userConnection", message);
  });

  socket.on("userMessage", (data) => {
    const userMessage = {
      id: socket.id,
      info: "message",
      name: userName,
      message: data.message,
      date: new Date().toTimeString(),
    };
    message.push(userMessage);
    io.sockets.emit("userMessage", message);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

// Ruta para la página de inicio (home)
app.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.render("home", { pageTitle: "Página de inicio", products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos");
  }
});

app.get("/contacto", (req, res) => {
  res.render("contacto", { pageTitle: "Contacto" });
});

app.get("/productos", (req, res) => {
  res.render("productos", { pageTitle: "Productos" });
});

app.get("/cart", (req, res) => {
  res.render("cart", { pageTitle: "Carrito" });
});
