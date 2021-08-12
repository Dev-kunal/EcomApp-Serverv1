const { Product } = require("../models/product.model");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get products",
      errorMessage: err.message,
    });
  }
};

const getAProduct = (req, res) => {
  let { product } = req;
  product.__v = undefined;
  res.json({ success: true, product });
};

module.exports = { getProducts, getAProduct };
