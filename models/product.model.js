const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  { 
name: {
  type:String,
  required:"Cant Enter product Without Name"
},
price: {
  type:Number,
  required:"Cant Enter product Without Price"
},
oldPrice: {
  type:Number,
},
images:Array,
features:Array,
inStock: Boolean,
fastDelivery: Boolean,
ratings: Number,
  },
  {
    timestamps:true
  }
  );

const Product = mongoose.model("Product", ProductSchema);


module.exports = { Product }