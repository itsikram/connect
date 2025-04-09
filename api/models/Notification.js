const {Schema,model} = require('mongoose')
const Profile = require('./Profile')
const NotificationSchema = new Schema({
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: Profile
    },
    text: String,
    icons: {
        type: String,
        default: 'https://programmerikram.com/wp-content/uploads/2025/03/ics_logo.png'
    },
    link: String,
    type: String,
    reacts: [{
        type: Object,
        ref: Profile

    }],
    isSeen: Boolean,
    timestamp: { type: Date, default: Date.now }
});

const Notification = model('Message', NotificationSchema);


module.exports = Notification