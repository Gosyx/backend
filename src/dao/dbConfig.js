import mongoose from "mongoose"

const URI="mongodb+srv://usergosyx:123@cluster0.xnogazt.mongodb.net/curso"

await mongoose.connect(URI,{
    serverSelectionTimeoutMS:5000,
})
console.log("Base de datos conectada....")


