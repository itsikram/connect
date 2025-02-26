const {Schema,model} = require('mongoose')

let userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    surname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        minLength: 10,
        maxLength: 40,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    DOB: {
        type: String,
        required: true    
    },
    gender: {
        type: String,
        trim: true,
        Required: true
    },
    profile: {
        'ref' : 'Profile',
        type: Schema.Types.ObjectId
    }
},{timestamps: true})

let User = model('User',userSchema)

module.exports = User