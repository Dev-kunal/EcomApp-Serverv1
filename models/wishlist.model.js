const mongoose = require("mongoose");
const { Schema }=require("mongoose");
const { User } = require("../models/user.model");
const { Product } = require("../models/product.model");
const WishlistSchema = new mongoose.Schema(
  {
    productId:{ type: mongoose.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true
  }
);

const WishlistItem = mongoose.model("WishlistItem", WishlistSchema);


module.exports = { WishlistItem }