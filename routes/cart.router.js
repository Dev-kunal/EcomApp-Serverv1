const express = require("express");
const router = express.Router();
const { CartItem } = require("../models/cart.model");

router.route("/").get(async (req, res) => {
  try {
    const cart = await CartItem.find({ userId: req.user.userId }).populate({
      path: "productId",
      select: "name price oldPrice ratings images inStock fastDelivery",
      model: "Product",
    });
    res.json({ success: true, cart });
  } catch (error) {
    console.log(error);
  }
});

// add to cart
router.route("/").post(async (req, res) => {
  try {
    const filter = {
      $and: [{ productId: req.body.productId }, { userId: req.user.userId }],
    };
    const findItem = await CartItem.findOne(filter);
    if (findItem) {
      res.json({ success: false, message: "Product already in Cart" });
    }
    console.log("userId from ad to cart", req.user.userId);
    // let cartItem = req.body;
    newCartItem = await CartItem.create({
      productId: req.body.productId,
      quantity: 1,
      userId: req.user.userId,
    });
    newCartItem = await newCartItem
      .populate({
        path: "productId",
        select: "name price oldPrice ratings images inStock fastDelivery",
        model: "Product",
      })
      .execPopulate();

    res.json({ success: true, newCartItem });
  } catch (err) {
    if (err.code === 11000) {
      res.json({ success: false, message: "Product is already in cart" });
    }
    res.json({ sucess: false, message: err.message });
  }
});

router.route("/update").post(async (req, res) => {
  try {
    let { productId, updateType } = req.body;
    let updateTerm;
    if (updateType === "INC") {
      updateTerm = 1;
    }
    if (updateType === "DEC") {
      updateTerm = -1;
    }
    const filter = {
      $and: [{ productId }, { userId: req.user.userId }],
    };
    // console.log("========>>>", filter);
    const result = await CartItem.findOne({ productId });
    // console.log("result", result);
    const updatedProduct = await CartItem.findOneAndUpdate(
      filter,
      { $inc: { quantity: updateTerm } },
      { new: true }
    ).populate({
      path: "productId",
      select:
        "name price oldPrice ratings images inStock fastDelivery,quantity",
      model: "Product",
    });

    // console.log("fuck..", updatedProduct);
    res.json({ success: true, updatedProduct });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// remove from cart
router.route("/remove").post(async (req, res) => {
  try {
    let { productId } = req.body;
    const filter = {
      $and: [{ productId }, { userId: req.user.userId }],
    };
    const removedCartItem = await CartItem.findOneAndDelete(filter);
    res.json({ succes: true, removedCartItem });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
module.exports = router;
