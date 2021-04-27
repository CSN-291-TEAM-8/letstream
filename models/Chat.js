const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    lastupdated: {
        type: Date,
    },
    name: {
        type: String,
        required: true
    },
    messages: [{ type: mongoose.Schema.ObjectId, ref: "Message" }]

})
module.exports = mongoose.model("Chat", ChatSchema);