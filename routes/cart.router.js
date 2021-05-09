const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { CartItem } = require("../models/cart.model");

router.use(bodyParser.json());

router.param("userId", async (req, res, next, userId) => {
  try {
    const cartItems = await CartItem.find({ userId: userId }).populate({
      path: "productId",
      model: "Product",
    });
    if (!cartItems) {
      res.status(400).json({ success: false, message: "Cart not found" });
    }
    req.cart = cartItems;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.route("/").post(async (req, res) => {
  try {
    let cartItem = req.body;
    const NewCartItem = await new CartItem(cartItem);
    const savedCartItem = await NewCartItem.save();
    res.json({ success: true, savedCartItem });
  } catch (err) {
    res.json({ sucess: false, message: err.message });
  }
});
router.route("/:userId").get((req, res) => {
  let { cart } = req;
  res.json({ success: true, cart: cart });
});
router.route("/update").post(async (req, res) => {
  try {
    let { userId, productId, updateType } = req.body;
    let updateTerm;
    if (updateType === "INC") {
      updateTerm = 1;
    }
    if (updateType === "DEC") {
      updateTerm = -1;
    }
    const obj = {
      $and: [{ productId: productId }, { userId: userId }],
    };
    const productToUpdate = await CartItem.findOneAndUpdate(
      obj,
      { $inc: { quantity: updateTerm } },
      { new: true }
    );
    res.json({ success: true, productToUpdate: productToUpdate });
  } catch (err) {
    res.josn({ success: false, message: err.message });
  }
});

router.route("/delete").post(async (req, res) => {
  try {
    let { productId, userId } = req.body;
    const obj = {
      $and: [{ productId: productId }, { userId: userId }],
    };
    // console.log(obj)
    const deleteCartItem = await CartItem.findOneAndDelete(obj);
    res.json({ succes: true, deletedItem: deleteCartItem });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
module.exports = router;
