import express from "express";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import * as path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import viewRouter from "./routes/views.router.js";
import productRouter from "./routes/products.router.js";
// import cartRouter from "./routes/carts.router.js";

import './dao/dbConfig.js'
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Server running on Express port: ${PORT}`);
  });

  const handlebars = exphbs.create();
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  app.engine("handlebars", handlebars.engine);
  app.set("view engine", "handlebars");
  app.set("views", path.resolve(__dirname, "views"));

  app.use("/", viewRouter);
  app.use("/api/products", productRouter);
  // app.use("/api/carts", cartRouter);