const express = require("express");

const router = express.Router();
const { WishlistItem } = require("../models/wishlist.model");
const { CartItem } = require("../models/cart.model");
const { extend } = require("lodash");

router.param("userId", async (req, res, next, userId) => {
  try {
    const wishlistItems = await WishlistItem.find({ userId: userId }).populate({
      path: "productId",
      model: "Product",
    });
    if (!wishlistItems) {
      res.status(400).json({ success: false, message: "Wishlist not found" });
    }
    req.wishlist = wishlistItems;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.route("/").post(async (req, res) => {
  try {
    let wishlistItem = req.body;
    const NewWishListItem = new WishlistItem(wishlistItem);
    const savedWishListItem = await NewWishListItem.save();
    res.json({ success: true, savedWishListItem });
  } catch (err) {
    res.json({ sucess: false, message: err.message });
  }
});
router.route("/delete").post(async (req, res) => {
  try {
    console.log(req.body.userId);
    let { productId, userId } = req.body;
    const obj = {
      $and: [{ productId: productId }, { userId: userId }],
    };
    console.log(obj);
    const deletedWish = await WishlistItem.findOneAndDelete(obj);
    res.json({ succes: true, deletedItem: deletedWish });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
// add to cart and remove from wishlist
router.route("/addtocart").post(async (req, res) => {
  try {
    let cartItem = req.body;
    const NewCartItem = new CartItem(cartItem);
    const savedCartItem = await NewCartItem.save();
    res.json({ success: true, savedCartItem });
  } catch (err) {
    res.json({ sucess: false, message: err.message });
  }
  try {
    let { productId, userId } = req.body;
    const obj = {
      $and: [{ productId: productId }, { userId: userId }],
    };
    console.log(obj);
    const deletedWish = await WishlistItem.findOneAndDelete(obj);
    res.json({ succes: true, deletedItem: deletedWish });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
router.route("/:userId").get((req, res) => {
  let { wishlist } = req;
  res.json({ success: true, wishlist: wishlist });
});

module.exports = router;
