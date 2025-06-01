const User = require('../models/User')
const Profile = require('../models/Profile')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET_KEY;


exports.signUp = async (req, res, next) => {
    let { firstName, surname, password, DOB, gender } = req.body
    let email = (req.body.email).toLowerCase();

    try {

        let isUser = await User.find({ email });
        if (isUser.length === 0) {

            let hashPassword = await bcrypt.hash(password, 10);

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
                fullName: firstName + ' ' + surname,
                displayName: surname
            })

            let profile = await profileData.save()

            if (profile) {

                let updatedUser = await User.findOneAndUpdate({ _id: saveUser._id }, { profile: profile._id }, { new: true })


                if (updatedUser) {
                    let accessToken = jwt.sign({ user_id: updatedUser._id }, SECRET_KEY, {
                        expiresIn: '5d'
                    })

                    return res.status(201).json({
                        firstName: updatedUser.firstName,
                        user_id: updatedUser._id,
                        surname: updatedUser.surname,
                        profile: updatedUser.profile,
                        accessToken
                    })
                }

            }


            return res.status(201).json({
                message: 'Account Created successfully'
            })

        } else {
            return res.status(200).json({ message: `Already Created a account with ${email}` });
        }




    } catch (e) {
        next(e)
    }

}
exports.changePass = async (req, res, next) => {
    let { newPassword, currentPassword, confirmPassword } = req.body
    let myProfile = req.profile || ''
    let userId = req.profile.user._id || ''
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Your New Password and confirm password is not same' })
    try {
        let user = await User.findOne({ profile: myProfile._id });

        let matchPassword = await bcrypt.compare(currentPassword, user.password)
        if (!matchPassword) return res.status(400).json({ message: 'Your Current Password Is Invalid' })
        if (matchPassword == true) {
            let newHashPassword = await bcrypt.hash(newPassword, 10);
            let updatedUser = await User.findOneAndUpdate({ _id: userId }, {
                password: newHashPassword
            }, { new: true })

            if (updatedUser) {
                let profile = await Profile.findOne({ _id: myProfile._id }).populate('user')
                let accessToken = jwt.sign({ user_id: userId.toString() }, SECRET_KEY, {
                    expiresIn: '30d'
                })

                let resData = {
                    firstName: updatedUser.firstName,
                    user_id: updatedUser._id,
                    surname: updatedUser.surname,
                    profile: profile._id,
                    accessToken
                }

                return res.json(resData).status(202)
            }

        }



    } catch (e) {
        next(e)
    }

}
exports.changeEmail = async (req, res, next) => {
    let { email } = req.body
    let userId = req.profile.user._id || ''
    try {
        let updatedUser = await User.findOneAndUpdate({ _id: userId }, { email }, { new: true })

        if (updatedUser) {


            let accessToken = jwt.sign({ user_id: updatedUser._id }, SECRET_KEY, {
                expiresIn: '30d'
            })

            return res.status(200).json({
                firstName: updatedUser.firstName,
                user_id: updatedUser._id,
                surname: updatedUser.surname,
                profile: updatedUser.profile,
                accessToken
            })

        }


    } catch (e) {
        next(e)
    }

}

exports.login = async (req, res, next) => {
    let password = req.body.password;
    let email = (req.body.email)?.toLowerCase();

    try {

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(200).json({
                'message': 'You Don\' Having An account'
            })
        }

        let matchPassword = await bcrypt.compare(password, user.password)

        if (!matchPassword) {
            return res.json({
                message: 'Invalid Password'
            }).status(200)
        }



        let accessToken = jwt.sign({ user_id: user._id }, SECRET_KEY, {
            expiresIn: '30d'
        })

        return res.status(202).json({
            firstName: user.firstName,
            user_id: user._id,
            surname: user.surname,
            profile: user.profile,
            accessToken
        })

    } catch (e) {
        next(e)
    }


}

exports.deleteAccount = async (req, res, next) => {
    let userData = req.body.userData
    let profileId = userData.profile;
    let userId = userData.user_id

    if (userId) {
        await User.findByIdAndDelete(userId)
    }

    if (profileId) {
        await Profile.findByIdAndDelete(profileId)
    }

    return res.json({ message: 'Account Deleted Successfully' })
}
