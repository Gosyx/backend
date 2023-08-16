import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  id: Number,
  products: [{
    pid: Number,
    quantity: Number,
  }],
});

const Cart = mongoose.model('Cart', cartSchema);

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartlist = await fs.promises.readFile(this.path, 'utf-8');
        const cartlistparse = JSON.parse(cartlist);
        return cartlistparse;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCartbyId(id) {
    const { cid } = id;
    const allcarts = await this.getCarts();
    const found = allcarts.find((element) => element.id === parseInt(cid));
    if (found) {
      return found;
    } else {
      console.error('cart no encontrado');
    }
  }

  async generateCartId() {
    if (fs.existsSync(this.path)) {
      const listadecarts = await this.getCarts();
      const counter = listadecarts.length;
      if (counter == 0) {
        return 1;
      } else {
        return listadecarts[counter - 1].id + 1;
      }
    }
  }

  async addCart() {
    const listadecarts = await this.getCarts();
    const id = await this.generateCartId();
    const cartnew = {
      id,
      products: [],
    };

    // Crear una instancia del modelo Cart y guardarla en la base de datos
    const newCart = new Cart(cartnew);
    await newCart.save();

    await fs.promises.writeFile(this.path, JSON.stringify(listadecarts, null, 2));
  }

  async addProductToCart(cid, pid) {
    const listaCarts = await this.getCarts();

    const cart = listaCarts.find((e) => e.id === cid);

    const productoIndex = cart.products.findIndex((element) => element.pid === pid);

    if (productoIndex !== -1) {
      cart.products[productoIndex].quantity++;
    } else {
      cart.products.push({
        pid,
        quantity: 1,
      });
    }

    await Cart.updateOne({ id: cid }, { products: cart.products });

    await fs.promises.writeFile(this.path, JSON.stringify(listaCarts, null, 2));
  }
}
