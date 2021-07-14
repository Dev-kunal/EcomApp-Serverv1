const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { User } = require("../models/user.model");
const { Product } = require("../models/product.model");
const CartSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Types.ObjectId, ref: Product },
    quantity: { type: Number },
    userId: { type: mongoose.Types.ObjectId, ref: User },
  },
  {
    timestamps: true,
  }
);

const CartItem = mongoose.model("CartItem", CartSchema);

module.exports = { CartItem };
