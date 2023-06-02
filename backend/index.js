const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const { dbConnect } = require("./config/dbConnect");
const authRouter = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const PORT = process.env.PORT || 4000;

dbConnect();

const app = express();

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

app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
