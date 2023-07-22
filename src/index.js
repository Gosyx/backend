import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import ProductRouter from "./router/products.routes.js";
import CartRouter from "./router/carts.routes.js";
import ProductManager from "./controllers/ProductManager.js";

const app = express();
const PORT = 8080;
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);

//estructura handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

//archivo estatico
app.use("/", express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  let allProducts = await product.getProducts();
  res.render("home", {
    title: "Hanasita | Handlebars",
    products: allProducts,
  });
});
app.get("/:id", async (req, res) => {
  console.log(req.params);
  let prod = await product.getProductsById(req.params.id);
  res.render("prod", {
    title: "Hanasita | Handlebars",
    products: prod,
  });
});
app.listen(PORT, () => {
  console.log(`Servidor por puerto ${PORT}`);
});
