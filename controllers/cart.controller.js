const { CartItem } = require("../models/cart.model");

const getCart = async (req, res) => {
  try {
    const cart = await CartItem.find({ userId: req.user.userId }).populate({
      path: "productId",
      select: "name price oldPrice ratings images inStock fastDelivery",
      model: "Product",
    });
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req.user;
    const filter = {
      $and: [{ productId }, { userId }],
    };
    const findItem = await CartItem.findOne(filter);
    if (findItem) {
      res.json({ success: false, message: "Product already in Cart" });
    }
    newCartItem = await CartItem.create({
      productId,
      quantity: 1,
      userId,
    });
    newCartItem = await newCartItem
      .populate({
        path: "productId",
        select: "name price oldPrice ratings images inStock fastDelivery",
        model: "Product",
      })
      .execPopulate();
    res.status(201).json({ success: true, newCartItem });
  } catch (err) {
    if (err.code === 11000) {
      res.json({ success: false, message: "Product is already in cart" });
    }
    res.status(500).json({ sucess: false, message: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, updateType } = req.body;
    const { userId } = req.user;
    let updateTerm;
    if (updateType === "INC") {
      updateTerm = 1;
    }
    if (updateType === "DEC") {
      updateTerm = -1;
    }
    const filter = {
      $and: [{ productId }, { userId }],
    };
    const result = await CartItem.findOne({ productId });
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

    res.status(201).json({ success: true, updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    let { productId } = req.body;
    const { userId } = req.user;
    const filter = {
      $and: [{ productId }, { userId }],
    };
    const removedCartItem = await CartItem.findOneAndDelete(filter);
    res.status(201).json({ succes: true, removedCartItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
};
