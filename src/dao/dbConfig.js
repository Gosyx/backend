import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const URI = process.env.MONGODB_URI

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conexión exitosa a MongoDB');
})
.catch(error => {
  console.error('Error al conectar a MongoDB:', error);
});

