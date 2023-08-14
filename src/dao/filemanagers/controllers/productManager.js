import Product from "../models/products.model.js"; // Importa el modelo de Producto

export default class ProductManager {
  constructor() {}

  async getProducts(info) {
    const { limit } = info;
    try {
      const productlist = await Product.find({}).limit(limit);
      return productlist;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductbyId(id) {
    const { pid } = id;
    try {
      const found = await Product.findById(pid);
      if (found) {
        return found;
      } else {
        console.error("Producto no encontrado");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProduct(obj) {
    try {
      const newProduct = new Product(obj);
      await newProduct.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProduct(id, obj) {
    const { pid } = id;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(pid, obj, {
        new: true,
      });
      if (!updatedProduct) {
        console.error("Producto no encontrado");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProduct(pid) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(pid);
      if (!deletedProduct) {
        console.error("Producto no encontrado");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
