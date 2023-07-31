import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { join } from "path";

const currentFileURL = import.meta.url;
const currentFilePath = fileURLToPath(currentFileURL);
const currentDirPath = join(currentFilePath, ".."); // Directorio actual

const cartsFilePath = join(currentDirPath, "../data/cart.json"); // Ruta al archivo cart.json relativa al directorio actual
const productsFilePath = join(currentDirPath, "../data/products.json"); // Ruta al archivo products.json relativa al directorio actual

class CartManager {
  // ... (código existente)

  getCartItems = async () => {
    try {
      const cartsData = await fs.readFile(cartsFilePath, "utf-8");
      const productsData = await fs.readFile(productsFilePath, "utf-8");

      const carts = JSON.parse(cartsData);
      const products = JSON.parse(productsData);

      const cartItems = carts.reduce((items, cart) => {
        const cartProducts = cart.products.map((productInCart) => {
          const product = products.find((p) => p.id === productInCart.pid);
          return {
            id: product.id,
            code: product.code,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: productInCart.quantity,
          };
        });

        return items.concat(cartProducts);
      }, []);

      return cartItems;
    } catch (error) {
      console.error("Error al obtener los productos del carrito:", error);
      return [];
    }
  };

  // ... (otras funciones del CartManager)
}

export default CartManager;
