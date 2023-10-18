const express = require("express");
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cart.controller");
const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);
router.post("/update", updateCart);
router.post("/remove", removeFromCart);

module.exports = router;
