const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  addToCart,
} = require("../controllers/wishlist.controller");

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.post("/remove", removeFromWishlist);
router.post("/addtocart", addToCart);

module.exports = router;
