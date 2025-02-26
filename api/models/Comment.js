const {Schema,model} = require('mongoose')
const Profile = require('../models/Profile')

const commentSchema = new Schema({
    body: {
        type: String,
        maxLength: 255
    },
    attachment: {
        type: String,
        maxLength: 255
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: Profile,

    },
    post: {
        type: Schema.Types.ObjectId,
        required: true
    },
    replies: [{
        type: Object
    }],
    reacts: [{
        type: Object
    }]

},{timestamps: true})

const Comment = model('Comment',commentSchema)

module.exports = Comment