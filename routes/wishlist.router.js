const express = require("express");
const router = express.Router();
const { WishlistItem } = require("../models/wishlist.model");
const { CartItem } = require("../models/cart.model");

router
  .get("/", async (req, res) => {
    try {
      const wishlist = await WishlistItem.find({
        userId: req.user.userId,
      }).populate({
        path: "productId",
        select: "name price oldPrice ratings images",
        model: "Product",
      });

      res.status(200).json({ success: true, wishlist });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  })
  .post("/", async (req, res) => {
    try {
      let { productId } = req.body;
      const filter = {
        $and: [{ productId }, { userId: req.user.userId }],
      };
      const findItem = await WishlistItem.findOne(filter);

      if (findItem) {
        res.json({ success: false, message: "Product is already in wishlist" });
        return;
      }

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
      res.status(201).json({ success: true, newItemInWishlist });
    } catch (err) {
      console.log({ err });
      res.status(500).json({ sucess: false, message: err.message });
    }
  });

router.post("/remove", async (req, res) => {
  try {
    let { productId } = req.body;
    const obj = {
      $and: [{ productId }, { userId: req.user.userId }],
    };
    const deletedItem = await WishlistItem.findOneAndDelete(obj);
    res.status(201).json({ succes: true, deletedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/addtocart", async (req, res) => {
  try {
    let { productId } = req.body;
    const filter = {
      $and: [{ productId }, { userId: req.user.userId }],
    };
    const findItem = await CartItem.findOne(filter);
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
    const deletedItem = await WishlistItem.findOneAndDelete(filter);
    res.status(201).json({ success: true, newCartItem });
  } catch (err) {
    res.status(500).json({ sucess: false, message: err.message });
  }
});

module.exports = router;
