const Post = require('../models/Post')
const { saveNotification } = require('./notificationController')

exports.postAddReact = async (req, res, next) => {
    try {

        let profile = req.profile._id
        let { type, post } = req.body
        let io = req.app.get('io')

        await Post.findOneAndUpdate({
            _id: post
        }, {
            $pull: {
                reacts: {
                    profile: profile,
                }
            }
        }, { new: true })

        let addReact = await Post.findOneAndUpdate({
            _id: post
        }, {
            $push: {
                reacts: {
                    profile,
                    type
                }
            }

        }, { new: true })


        let notification = {
            receiverId: profile,
            text: `${friendProfile.fullName} Reacted your post`,
            link: '/post/' + savedCommentData._id,
            type: 'postCommentReply',
            icon: friendProfile.profilePic
        }

        saveNotification(io, notification)

        return res.json(addReact).status(200)

    } catch (error) {
        console.log(error)
    }
}

exports.postRemoveReact = async (req, res, next) => {
    try {
        let profile = req.profile._id
        let { post } = req.body
        let io = req.app.get('io')

        let removeReact = await Post.findByIdAndUpdate({
            _id: post
        }, {
            $pull: {
                reacts: {
                    profile: profile,
                }
            }
        }, { new: true })

        return res.json(removeReact)

    } catch (error) {
        next(error)
    }
}

exports.addStoryReact = async (req, res, next) => {

}
exports.deleteStoryReact = async (req, res, next) => {

}

