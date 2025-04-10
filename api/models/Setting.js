const {Schema,model} = require('mongoose')
const Profile = require('./Profile')
let settingSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    nickanme: {
        type: String,
        trim: true,
        required: true
    },
    profile: {
        ref : Profile,
        type: Schema.Types.ObjectId
    }
},{timestamps: true})

let Setting = model('Setting',settingSchema)

module.exports = Setting