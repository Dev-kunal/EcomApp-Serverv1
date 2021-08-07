const express = require("express");
const { CartItem } = require("../models/cart.model");
const router = express.Router();

router.post("/", async (req, res) => {
  // { $in: [<value1>, <value2>, ... <valueN> ] }
  try {
    let { itemsInCart } = req.body;
    const productsToDelete = itemsInCart.map((item) => item._id);
    const deletedItem = await CartItem.deleteMany({
      _id: { $in: [...productsToDelete] },
    });
    console.log(deletedItem);
    res.json({ success: true, message: "Payment Successfull..!" });
  } catch (err) {
    res.json({ sucess: false, message: err.message });
  }
});

module.exports = router;
