// ProductManager.js

import { promises as fs } from "fs";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json"; // Ruta al archivo JSON que contiene los productos
  }

  readProducts = async () => {
    try {
      let products = await fs.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      // Si ocurre un error al leer el archivo, se devuelve un arreglo vacío
      return [];
    }
  };

  getProductById = async (id) => {
    let products = await this.readProducts();
    return products.find((product) => product.id === id);
  };

  getProducts = async () => {
    return await this.readProducts();
  };

  // Aquí puedes implementar otras funciones para gestionar los productos, como agregar un nuevo producto, editar un producto existente, etc.
}

export default ProductManager;
