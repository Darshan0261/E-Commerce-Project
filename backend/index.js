const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { dbConnect } = require("./config/dbConnect");
const authRouter = require("./routes/authRoutes");
const blogCategoryRouter = require("./routes/blogCategoryRoutes");
const blogRouter = require("./routes/blogRoutes");
const brandRouter = require("./routes/brandRoutes");
const couponRouter = require("./routes/couponRoutes");
const prodCategoryRouter = require("./routes/prodCategoryRoutes");
const productRouter = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const PORT = process.env.PORT || 4000;

dbConnect();

const app = express();

app.use(morgan("dev"));

app.use(
    cors({
        origin: "*",
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("E-Commerce Base API Endpoint");
});

app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/blog", blogRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/product-category", prodCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
