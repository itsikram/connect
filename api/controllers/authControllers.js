const User = require('../models/User')
const Profile = require('../models/Profile')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SECRET_KEY = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";


exports.signUp = async(req,res,next) => {
    let {firstName,surname,email,password,DOB,gender} = req.body

    try {
       
        let isUser = await User.find({email});
        if(isUser.length === 0) {

            let hashPassword = await bcrypt.hash(password,10);
    
            let saveUser = User({
                firstName,
                surname,
                email,
                password: hashPassword,
                DOB,
                gender
            })
    
            let userData = await saveUser.save();
            let profileData = new Profile({
                user: userData._id,
                fullName: firstName +' ' + surname
            })

            let profile = await profileData.save()

            await User.findOneAndUpdate({_id: profile.user},{profile: profile._id})
            

            return res.status(201).json({
                message: 'Account Created successfully'
            })

        }else {
            return res.status(200).json({message: `Already Created a account with ${email}`});
        }




    }catch(e) {
        next(e)
    }
    
}
exports.changePass = async(req,res,next) => {
    let {newPassword,currentPassword,confirmPassword} = req.body
    let myProfile = req.profile || ''
    let userId = req.profile.user._id || ''
    if(newPassword !== confirmPassword) return res.status(400).json({message: 'Your New Password and confirm password is not same'})
    try {
        let user = await User.findOne({profile: myProfile._id});

        let matchPassword = await bcrypt.compare(currentPassword,user.password)
        if(!matchPassword) return res.status(400).json({message: 'Your Current Password Is Invalid'})
        if( matchPassword == true) {
            let newHashPassword = await bcrypt.hash(newPassword,10);
            let updatedUser = await User.findOneAndUpdate({_id:userId },{
                password: newHashPassword
            },{new: true})

            if(updatedUser) {
                let profile = await Profile.findOne({_id: myProfile._id}).populate('user')
                let accessToken =  jwt.sign({user_id: userId.toString()},SECRET_KEY,{
                    expiresIn: '5d'
                })

                let resData = {
                    firstName: updatedUser.firstName,
                    user_id: updatedUser._id,
                    surname:updatedUser.surname,
                    profile: profile._id,
                    accessToken
                }
                console.log(resData)

                return res.json(resData).status(202)
            }

        }



    }catch(e) {
        next(e)
    }
    
}

exports.login = async(req,res,next) => {
    let {email,password } = req.body;

    try{
        
        let user = await User.findOne({email})

        if ( !user) {
            return res.status(200).json({
                'message': 'You Don\' Having An account'
            })
        }

        let matchPassword = await bcrypt.compare(password,user.password)

        if(!matchPassword) {
            return res.json({
                message: 'Invalid Password'
            }).status(200)
        }



        let accessToken =  jwt.sign({user_id: user._id},SECRET_KEY,{
            expiresIn: '5d'
        })

        return res.status(202).json({
            firstName: user.firstName,
            user_id: user._id,
            surname:user.surname,
            profile: user.profile,
            accessToken
        })

    }catch(e){
        next(e)
    }
    

}