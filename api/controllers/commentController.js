const { response } = require('express')
const Comment = require('../models/Comment')
const Post = require('../models/Post')


exports.postAddComment = async(req,res,next) => {
    try {
        let attachment = req.body.attachment ? req.body.attachment : ''
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

exports.postDeleteComment = async(req,res,next) => {
    try {
        let commentId = req.body.commentId
        let deleteComment = await Comment.findOneAndDelete({_id: commentId})
        if(deleteComment) {
            await Post.findByIdAndUpdate({
                _id: commentId
            },{
                $pull: {
                    comments: commentId
                }
            },{new: true})
    
            return res.json({message: 'Comment Deleted Successfully'}).status(200)
        }else {
            return res.json({message: 'Comment Deletion Failed'}).status(500)

        }


    } catch (error) {
        next(error)
    }
}
exports.storyAddComment = async(req,res,next) => {
    try {
        let attachment = req.body.attachment ? req.body.attachment : ''
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