const { response } = require('express')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const CmntReply = require('../models/CmntReply')
const {saveNotification} = require('./notificationController')
exports.postAddComment = async (req, res, next) => {
    try {
        let attachment = req.body.attachment ? req.body.attachment : ''
        let body = req.body.body
        let post = req.body.post
        let profile = req.profile._id

        let io = req.app.get('io')
        
        let commentData = new Comment({
            attachment,
            body,
            author: profile,
            post
        })
        let savedCommentData = await commentData.save()

        let updatePost = await Post.findOneAndUpdate({
            _id: post
        }, {
            $push: {
                comments: savedCommentData._id
            }
        }, { new: true }).populate('author')

        let friendProfile = await Post.findOne({_id: post}).populate('author')

        let notification = {
            receiverId: updatePost.author._id,
            text: `${updatePost.author.fullName} Commented in you post`,
            link: '/post/'+post,
            type: 'postComment',
            icon: updatePost.author.profilePic
        }

        saveNotification(io, notification)

        return res.json(savedCommentData)

    } catch (error) {
        next(error)
    }
}

exports.addCommentReact = async (req, res, next) => {
    try {
        let reactorId = req.body.reactorId
        let commentId = req.body.commentId

        if (!reactorId || !commentId) return;
        let updatedComment = await Comment.findOneAndUpdate({
            _id: commentId,
            reacts: {
                $nin: reactorId
            }
        }, {
            $push: {
                reacts: reactorId
            }
        }, { new: true })
        if (updatedComment) {
            return res.json({ messasge: 'Comment Reacted Successfully' }).status(200)
        }
        return res.json({ messasge: 'Comment Cannot Be Reacted' }).status(400)

    }
    catch (e) { next(e) }
}

exports.removeCommentReact = async (req, res, next) => {
    try {
        let reactorId = req.body.reactorId
        let commentId = req.body.commentId
        let updatedComment = await Comment.findOneAndUpdate({ _id: commentId }, {
            $pull: {
                reacts: reactorId
            }
        }, { new: true })

        if (updatedComment) {
            return res.json({ messasge: 'Comment React Removed Successfully' }).status(200)
        }
        return res.json({ messasge: 'Comment React Cannot Be Removed' }).status(400)

    }
    catch (e) { next(e) }
}

exports.postCommentReply = async (req, res, next) => {
    try {
        let commentId = req.body.commentId
        let authorId = req.body.authorId
        let replyMsg = req.body.replyMsg
        let io = req.app.get('io')


        if (!commentId || !authorId) return next();

        let newReplyData = new CmntReply({
            body: replyMsg,
            author: authorId,
            parent: commentId
        })

        let newReply = await newReplyData.save()
        if (newReply !== null) {
            let updateComment = await Comment.findOneAndUpdate({ _id: commentId }, {
                $push: {
                    replies: newReply._id
                }
            },{new: true}).populate([{
                path: 'post',
                model: Post,
                populate: {
                    path: 'author',
                    model: Profile
                }

            }])
            if (updateComment) {
                console.log('updateComment',updateComment)
                let newReplyWithAuthor = await CmntReply.findOne({ _id: newReply._id }).populate('author')

                if (newReplyWithAuthor) {

                    let notification = {
                        receiverId: updateComment.post.author._id,
                        text: `${updateComment.post.author.fullName} Replied to your comment`,
                        link: '/post/'+(updateComment.post).toString(),
                        type: 'postCommentReply',
                        icon: updateComment.post.author.profilePic
                    }
            
                    saveNotification(io, notification)
                    return res.json(newReplyWithAuthor).status(200)

                }
            }
        }



        return res.json({ message: 'Something Went Wrong' }).status(400)
    } catch (e) { next(e) }
}

exports.removeCommentReply = async (req, res, next) => {
    try {

        let replyId = req.body.replyId

        let deletedReply = await CmntReply.findOneAndDelete({ _id: replyId })

        if (deletedReply) {

            let pullReplyIdFromCmnt = await Comment.findOneAndUpdate({ _id: deletedReply.parent }, {
                $pull: {
                    replies: deletedReply._id
                }
            })

            if (pullReplyIdFromCmnt) {
                return res.json({ message: 'Comment Reply Deleted Successfully' }).status(200)

            }
        }
        return res.json({ message: 'Comment Reply Deletion Failed' }).status(400)


    } catch (e) { next(e) }
}

exports.addReplyReact = async (req, res, next) => {
    let replyId = req.body.replyId
    let myId = req.body.myId
    try {
        let addedReact = await CmntReply.findOneAndUpdate({
            _id: replyId, reacts: {
                $nin: myId
            }
        },{
            $push: {
                reacts: myId
            }
        })

        if(addedReact) {
            return res.json({message: 'Reply React added sucessfully'}).status(200)
        }

        return res.json({message: 'Reply React Cannot be added'})
    } catch (e) { next(e) }

}
exports.removeReplyReact = async (req, res, next) => {
    let replyId = req.body.replyId
    let myId = req.body.myId
    try {

        let removedReact = await CmntReply.findOneAndUpdate({_id: replyId},{
            $pull: {
                reacts: myId
            }
        })

        if(removedReact) {
            return res.json({message: 'Reply React Removed Sucessfully'}).status(200)
        }
        return res.json({message: 'Reply React cannot be removed'}).status(400)
        
    } catch (error) {
        next(error)
    }
}

exports.postDeleteComment = async (req, res, next) => {
    try {
        let commentId = req.body.commentId
        let deleteComment = await Comment.findOneAndDelete({ _id: commentId })
        if (deleteComment) {
            await Post.findByIdAndUpdate({
                _id: commentId
            }, {
                $pull: {
                    comments: commentId
                }
            }, { new: true })

            return res.json({ message: 'Comment Deleted Successfully' }).status(200)
        } else {
            return res.json({ message: 'Comment Deletion Failed' }).status(500)

        }


    } catch (error) {
        next(error)
    }
}
exports.storyAddComment = async (req, res, next) => {
    try {

        let attachment = req.body.attachment ? req.body.attachment : ''
        let body = req.body.body
        let post = req.body.post
        let profile = req.profile._id
        let io = req.app.get('io')

        let commentData = new Comment({
            attachment,
            body,
            author: profile,
            post
        })

        let savedCommentData = await commentData.save()

        let updatePost = await Post.findOneAndUpdate({
            _id: post
        }, {
            $push: {
                comments: savedCommentData._id
            }
        }, { new: true }).populate('author')

        
        let notification = {
            receiverId: updatePost.author._id,
            text: `${updatePost.author.fullName} Commented to your story`,
            link: '/story/',
            type: 'storyComment',
            icon: updatePost.author.profilePic
        }

        saveNotification(io, notification)

        return res.json(savedCommentData)

    } catch (error) {
        next(error)
    }
}