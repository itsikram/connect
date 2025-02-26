const jwt = require('jsonwebtoken')
const Profile = require('../models/Profile')


const SECRET_KEY = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";


let isAuth = async(req,res,next) => {

    try {
        let token = req.headers.authorization
        let {user_id} = jwt.verify(token,SECRET_KEY)
        let profileData = await Profile.findOne({user: user_id}).populate('user')
        if(!profileData) {
            return res.json({
                message: 'You are not a authenticated User'
            }).status(401)
        }
        req.profile = profileData
        next()
        
    } catch (error) {
        next(error)
    }

}

module.exports = isAuth