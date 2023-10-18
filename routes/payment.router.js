const express = require("express");
const { CartItem } = require("../models/cart.model");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { itemsInCart } = req.body;
    const productsToDelete = itemsInCart.map((item) => item._id);
    const deletedItem = await CartItem.deleteMany({
      _id: { $in: [...productsToDelete] },
    });
    console.log(deletedItem);
    res
      .status(200)
      .json({
        success: true,
        message:
          "Payment received successfully..! Your products will be delivered soon..!",
      });
  } catch (err) {
    res.status(500).json({ sucess: false, message: err.message });
  }
});

module.exports = router;
