const {Schema,model } = require('mongoose')
const User = require('./User')


let profileSchema = new Schema({
    username: {
        type: String,
        minLength: 5,
        maxLength: 50
    },
    fullName: {
        type: String,
    },
    coverPic: {
        type: String,
        default: 'default-cover.jpg'
    },
    profilePic: {
        type: String,
        default: 'default-profilePic.jpg'
    },
    bio: {
        type: String,
        maxLength: 200,
        default: 'Hello World, I am a new User'
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }],
    friendReqs: [{
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }],
    following: [{
        type: Schema.Types.ObjectId
    }],
    settings: {
        type: Object,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

},{timestamps: true})

let Profile = model('Profile',profileSchema)


module.exports  = Profile



