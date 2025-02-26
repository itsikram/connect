const Comment = require('../models/Comment')
const Post = require('../models/Post')


exports.postAddComment = async(req,res,next) => {
    try {
        let attachment = req.file ? req.file.filename : ''
        let body = req.body.body
        let post = req.body.post
        let profile = req.profile._id

        let commentData = new Comment({
            attachment,
            body,
            author: profile,
            post
        })

        let savedCommentData = await commentData.save()

        let updatePost = await Post.findOneAndUpdate({
            _id: post
        },{
            $push: {
                comments: savedCommentData._id
            }
        },{new: true})

        res.json(savedCommentData)

    } catch (error) {
        next(error)
    }
}