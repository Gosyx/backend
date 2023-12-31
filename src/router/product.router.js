import { Router } from "express";
import ProductsModel from "../dao/models/products.js";

const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const results = await ProductsModel.paginate(
    query ? { category: query } : {},
    { limit, page, lean: true, sort: sort ? { price: 1 } : { price: -1 } }
  );
  let prevLink = results.hasPrevPage
    ? `http://localhost:8080/productos/?page=${
        +page - 1
      }&limit=${limit}&query=${query}&sort=${sort}`
    : null;
  let nextLink = results.hasNextPage
    ? `http://localhost:8080/productos/?page=${
        +page + 1
      }&limit=${limit}&query=${query}&sort=${sort}`
    : null;
  results.prevLink = prevLink;
  results.nextLink = nextLink;
  res.send(results);
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  let producto = await ProductsModel.findById(pid);
  return res.json({ message: "producto encontrado", data: producto });
});

router.post("/agregarProducto", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    res.json({ message: "faltan datos" });
  } else {
    const productoNuevo = {
      title: title,
      description: description,
      code: code,
      price: +price,
      status: true,
      stock: +stock,
      category: category,
      thumbnail: thumbnail,
    };

    let result = await ProductsModel.insertMany([productoNuevo]);
    return res.status(201).json({ message: "Producto agregado", data: result });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { price } = req.body;

  if (!price) {
    return res.status(500).json({ message: "Faltan datos" });
  } else {
    const producto = {
      price: price,
    };

    let result = await ProductsModel.findByIdAndUpdate(pid, producto);
    return res.json({ message: "producto actualizado", data: result });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  let result = await ProductsModel.findByIdAndDelete(pid);
  if (result === null) {
    return res.status(404).json({ message: "Producto no encontrado" });
  } else {
    res.json({ message: "producto eliminado", data: result });
  }
});

export default router;
