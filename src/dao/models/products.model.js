import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId, 
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  });
  
  const products = mongoose.model("products", productSchema);
  
  export default products;