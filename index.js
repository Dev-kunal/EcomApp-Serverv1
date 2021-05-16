const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json({ urlExtended: true }));
app.use(cors());
const productRouter = require("./routes/product.router.js");
const userRouter = require("./routes/user.router");
const cartRouter = require("./routes/cart.router");
const wishlistRouter = require("./routes/wishlist.router");

const { initializeDBConnection } = require("./db/db.connect.js");
initializeDBConnection();

app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.get("/", (req, res) => {
  res.json({ message: "WEl-Come" });
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found on server, please check",
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
