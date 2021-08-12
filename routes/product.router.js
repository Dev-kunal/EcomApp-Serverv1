const express = require("express");
const { getProductById } = require("../controllers/param.controller");
const {
  getProducts,
  getAProduct,
} = require("../controllers/product.controller");
const router = express.Router();

router.param("productId", getProductById);
router.get("/", getProducts);
router.get("/:productId", getAProduct);

module.exports = router;
