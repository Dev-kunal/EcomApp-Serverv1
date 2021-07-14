const express = require("express");
const router = express.Router();
const { WishlistItem } = require("../models/wishlist.model");
const { CartItem } = require("../models/cart.model");

router.get("/", async (req, res) => {
  try {
    const wishlist = await WishlistItem.find({
      userId: req.user.userId,
    }).populate({
      path: "productId",
      select: "name price oldPrice ratings images",
      model: "Product",
    });

    res.json({ success: true, wishlist });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("inside wishlist add", req.body);
    let { productId } = req.body;
    const filter = {
      $and: [{ productId }, { userId: req.user.userId }],
    };
    const findItem = await WishlistItem.findOne(filter);
    // console.log("item", findItem);
    if (findItem) {
      res.json({ success: false, message: "Product is already in wishlist" });
      return;
    }
    // console.log("from add to wishlist", req.user.userId);
    let newItemInWishlist = {
      productId,
      userId: req.user.userId,
    };
    newItemInWishlist = await WishlistItem.create(newItemInWishlist);
    await newItemInWishlist.save();
    newItemInWishlist = await newItemInWishlist
      .populate({
        path: "productId",
        select: "name price oldPrice ratings images",
        model: "Product",
      })
      .execPopulate();
    res.json({ success: true, newItemInWishlist });
  } catch (err) {
    console.log({ err });
    res.json({ sucess: false, message: err.message });
  }
});

router.post("/remove", async (req, res) => {
  try {
    let { productId } = req.body;
    const obj = {
      $and: [{ productId }, { userId: req.user.userId }],
    };
    const deletedItem = await WishlistItem.findOneAndDelete(obj);
    res.json({ succes: true, deletedItem });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// add to cart and remove from wishlist
router.post("/addtocart", async (req, res) => {
  try {
    let { productId } = req.body;
    const filter = {
      $and: [{ productId }, { userId: req.user.userId }],
    };
    const findItem = await CartItem.findOne(filter);
    // console.log("from add to cart", req.user.userId);
    if (findItem) {
      res.json({ success: false, message: "Product is already in cart" });
      return;
    }
    let newItem = { productId, userId: req.user.userId, quantity: 1 };
    newCartItem = await CartItem.create(newItem);
    newCartItem = await newCartItem
      .populate({
        path: "productId",
        select: "name price oldPrice ratings images",
        model: "Product",
      })
      .execPopulate();
    // console.log("inside this");
    const deletedItem = await WishlistItem.findOneAndDelete(filter);
    res.json({ success: true, newCartItem });
  } catch (err) {
    res.json({ sucess: false, message: err.message });
  }
});

module.exports = router;
