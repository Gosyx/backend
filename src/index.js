import express from "express";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import * as path from "path";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import db from "./dao/dbConfig.js";
import ProductManager from "./dao/mongomanagers/productManagerMongo.js";
import viewRouter from "./routes/views.router.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8080;

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Manejar eventos de conexión de Mongoose
db.once("open", () => {
  console.log("MongoDB connection established");

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

    // Nombre del usuario
    let userName = "";

    // Mensaje de Conexión
    socket.on("userConnection", (data) => {
      userName = data.user;
      message.push({
        id: socket.id,
        info: "connection",
        name: data.user,
        message: `${data.user} Conectado`,
        date: new Date().toTimeString(),
      });
      io.sockets.emit("userConnection", message);
    });

    // Mensaje de Mensaje enviado
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

    // Mensaje Usuario escribiendo
    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", data);
    });
  });
});
