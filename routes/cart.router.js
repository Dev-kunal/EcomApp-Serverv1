const express = require("express");
const router = express.Router();
const { CartItem } = require("../models/cart.model");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const cart = await CartItem.find({ userId: req.user.userId }).populate({
        path: "productId",
        select: "name price oldPrice ratings images inStock fastDelivery",
        model: "Product",
      });
      res.status(200).json({ success: true, cart });
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res) => {
    try {
      const filter = {
        $and: [{ productId: req.body.productId }, { userId: req.user.userId }],
      };
      const findItem = await CartItem.findOne(filter);
      if (findItem) {
        res.json({ success: false, message: "Product already in Cart" });
      }
      console.log("userId from ad to cart", req.user.userId);
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

      res.status(201).json({ success: true, newCartItem });
    } catch (err) {
      if (err.code === 11000) {
        res.json({ success: false, message: "Product is already in cart" });
      }
      res.status(500).json({ sucess: false, message: err.message });
    }
  });

// add to cart
// router.route("/").post(async (req, res) => {
//   try {
//     const filter = {
//       $and: [{ productId: req.body.productId }, { userId: req.user.userId }],
//     };
//     const findItem = await CartItem.findOne(filter);
//     if (findItem) {
//       res.json({ success: false, message: "Product already in Cart" });
//     }
//     console.log("userId from ad to cart", req.user.userId);
//     // let cartItem = req.body;
//     newCartItem = await CartItem.create({
//       productId: req.body.productId,
//       quantity: 1,
//       userId: req.user.userId,
//     });
//     newCartItem = await newCartItem
//       .populate({
//         path: "productId",
//         select: "name price oldPrice ratings images inStock fastDelivery",
//         model: "Product",
//       })
//       .execPopulate();

//     res.json({ success: true, newCartItem });
//   } catch (err) {
//     if (err.code === 11000) {
//       res.json({ success: false, message: "Product is already in cart" });
//     }
//     res.json({ sucess: false, message: err.message });
//   }
// });

router.post("/update", async (req, res) => {
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
});

router.post("/remove", async (req, res) => {
  try {
    let { productId } = req.body;
    const filter = {
      $and: [{ productId }, { userId: req.user.userId }],
    };
    const removedCartItem = await CartItem.findOneAndDelete(filter);
    res.status(201).json({ succes: true, removedCartItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;
