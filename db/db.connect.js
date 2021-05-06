const mongoose = require("mongoose")

const initializeDBConnection=async()=>{
  try{
  await mongoose.connect("mongodb+srv://kunaltijare:kunaltijarecluster@cluster0.i2ze7.mongodb.net/inventory?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  console.log("mongoose connected successfully")
  }catch(err){
      console.error("mongoose connection failed...", err)
  }
}

module.exports = { initializeDBConnection }
