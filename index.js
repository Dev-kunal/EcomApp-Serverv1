const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json({ urlExtended: true }));
app.use(cors());
const { initializeDBConnection } = require("./db/db.connect.js");
initializeDBConnection();
const productRouter = require("./routes/product.router.js");
const userRouter = require("./routes/user.router");
const cartRouter = require("./routes/cart.router");
const wishlistRouter = require("./routes/wishlist.router");
const paymentRouter = require("./routes/payment.router");

const authVerify = require("./middleware/authVerify.js");

app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/cart", authVerify, cartRouter);
app.use("/wishlist", authVerify, wishlistRouter);
app.use("/payment", paymentRouter);

app.get("/", (req, res) => {
  res.json({ message: "Ecom SeverV1" });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found on server, please check",
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
