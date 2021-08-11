const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const { initializeDBConnection } = require("./db/db.connect.js");

initializeDBConnection();
const productRouter = require("./routes/product.router.js");
const userRouter = require("./routes/user.router");
const cartRouter = require("./routes/cart.router");
const wishlistRouter = require("./routes/wishlist.router");
const paymentRouter = require("./routes/payment.router");

const authVerify = require("./middleware/authVerify.js");
const routeHandler = require("./middleware/routeHandler");

app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/cart", authVerify, cartRouter);
app.use("/wishlist", authVerify, wishlistRouter);
app.use("/payment", authVerify, paymentRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Ecom SeverV1" });
});

app.use(routeHandler);

app.listen(process.env.PORT || 7000, () => {
  console.log("Server Started");
});
