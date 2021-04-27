const mongoose = require("mongoose");

const MsgSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    roomid: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
module.exports = mongoose.model("Message", MsgSchema);