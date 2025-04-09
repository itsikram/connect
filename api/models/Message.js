const mongoose = require('mongoose')
const Profile = require('./Profile')
const messageSchema = new mongoose.Schema({
    room: String,
    senderId: String,
    receiverId: String,
    message: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    reacts: [{
        type: Object,
        ref: Profile

    }],
    isSeen: Boolean,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);


module.exports = Message