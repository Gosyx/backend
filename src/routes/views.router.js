import { Router } from "express";
import { __dirname } from "../utils.js";
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";

const pmanager = new ProductManager();

const router = Router();

// Ruta para la página de inicio (home)
router.get("/", async (req, res) => {
  try {
    const products = await pmanager.getProducts(); 
    res.render("home", {
       title: "Hanasitart",
        products : products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos");
  }
});

router.get("/real-time-products", async (req, res) => {
  try {
    const products = await pmanager.getProducts();
    res.render("realTimeProducts", { pageTitle: "Productos en Tiempo Real", products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos");
  }
});

router.get("/contacto", (req, res) => {
  res.render("contacto", { pageTitle: "Contacto" });
});

router.get("/productos", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.render("productos", { pageTitle: "Lista de Productos", products });
  } catch (error) {
    res.render("productos", { pageTitle: "Lista de Productos", products: [] });
  }
});


router.get("/cart", (req, res) => {
  res.render("cart", { pageTitle: "Carrito" });
});

export default router;
