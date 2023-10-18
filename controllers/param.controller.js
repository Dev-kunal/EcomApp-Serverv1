const { Product } = require("../models/product.model");

const getProductById = async (req, res, next, productId) => {
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
};
module.exports = { getProductById };
