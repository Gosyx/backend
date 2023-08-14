import mongoose from "mongoose";

const URI = "mongodb+srv://usergosyx:123@cluster0.xnogazt.mongodb.net/";

const db = mongoose.connection;

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

export default db;
