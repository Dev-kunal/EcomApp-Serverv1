const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model");
const { extend } = require("lodash");

router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res
        .status(400)
        .json({ success: false, message: "Product not found in DB" });
    }
    req.product = product;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.route("/").get(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to get products",
      errorMessage: err.message,
    });
  }
});

router.route("/:productId").get((req, res) => {
  let { product } = req;
  product.__v = undefined;
  res.json({ success: true, product });
});

module.exports = router;
