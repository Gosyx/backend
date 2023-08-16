import Product from "../models/products.model.js";

export default class ProductManager {

  async getProducts() {
    try {
      const productlist = await Product.find({}).lean().exec();
      return productlist;
    } catch (error) {
      return {
        code: 500,
        status: "Error",
        message: error.message
      };
    }
  }

  async getProductbyId(id) {
    const { pid } = id;
    const product = await Product.findById(pid).lean().exec();
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado");
    }
  }

  async addProduct(obj) {
    try {
      const newproduct = await Product.create(obj);
      return {
        code: 202,
        status: 'Success',
        message: `El producto ${newproduct.title} ha sido agregado con éxito. Su ID interno es ${newproduct._id}`
      };
    } catch (error) {
      return {
        code: 400,
        status: 'Error',
        message: `${error}`
      };
    }
  }

  async updateProduct(id, obj) {
    try {
      const productUpdated = await Product.findByIdAndUpdate(id, obj, {
        new: true
      }).lean().exec();
      return productUpdated;
    } catch (error) {
      return {
        code: 400,
        status: 'Error',
        message: `${error}`
      };
    }
  }

  async deleteProduct(pid) {
    try {
      const productToDelete = await Product.findByIdAndDelete(pid).lean().exec();

      if (productToDelete) {
        return {
          code: 202,
          status: 'Success',
          message: `El producto con ID ${pid} ha sido eliminado exitosamente.`
        };
      } else {
        return {
          code: 404,
          status: 'Error',
          message: `No se encontró un producto con ID ${pid}.`
        };
      }
    } catch (error) {
      return {
        code: 400,
        status: 'Error',
        message: `${error}`
      };
    }
  }
}
