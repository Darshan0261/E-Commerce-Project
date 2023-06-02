const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    refreshTokens: {
        type: [String],
        default: [],
    },
    tokens: {
        type: [String],
        default: [],
    },
});

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModel;
