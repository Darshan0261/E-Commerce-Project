const { default: mongoose } = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
        console.log("Cannot Connect to DB");
    }
};

module.exports = {
    dbConnect,
};
