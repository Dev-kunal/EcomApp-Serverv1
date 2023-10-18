const { WishlistItem } = require("../models/wishlist.model");
const { CartItem } = require("../models/cart.model");

const getWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const wishlist = await WishlistItem.find({
      userId,
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
};

const addToWishlist = async (req, res) => {
  try {
    let { productId } = req.body;
    const { userId } = req.user;
    const filter = {
      $and: [{ productId }, { userId }],
    };
    const findItem = await WishlistItem.findOne(filter);
    if (findItem) {
      res.json({ success: false, message: "Product is already in wishlist" });
      return;
    }
    let newItemInWishlist = {
      productId,
      userId,
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
};

const removeFromWishlist = async (req, res) => {
  try {
    let { productId } = req.body;
    const { userId } = req.user;
    const obj = {
      $and: [{ productId }, { userId }],
    };
    const deletedItem = await WishlistItem.findOneAndDelete(obj);
    res.status(201).json({ succes: true, deletedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    let { productId } = req.body;
    const { userId } = req.user;
    const filter = {
      $and: [{ productId }, { userId }],
    };
    const findItem = await CartItem.findOne(filter);
    if (findItem) {
      res.json({ success: false, message: "Product is already in cart" });
      return;
    }
    let newItem = { productId, userId, quantity: 1 };
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
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  addToCart,
};
