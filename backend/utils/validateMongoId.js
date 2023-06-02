const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        res.status(400);
        throw new Error("Invalid ID provided");
    }
};

module.exports = validateMongoDbId;
