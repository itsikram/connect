const Post = require('../models/Post')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Comment = require('../models/Comment')
const jwt = require('jsonwebtoken')
const CmntReply = require('../models/CmntReply')
const mongoose = require('mongoose')


exports.createPost = async(req,res,next) => {
    try {
        let profileId = req.profile._id
        let caption = req.body.caption
        let thumbnail_url = req.body.urls
        let post = new Post({
            caption,
            photos: thumbnail_url,
            author: profileId

        })

        let savedData = await post.save()

        let getPost = await Post.findOne({_id: savedData._id}).populate([
            {
                path: 'author',
                model: Profile,
                populate: {
                    path: 'user'
                }
            },
            {
                path: 'comments',
                model: Comment,
                populate:[ {
                    path: 'author',
                    select: ['profilePic','user'],
                    populate: {
                        path: 'user',
                        select: ['firstName','surname']
                    }
                },{
                    path: 'replies',
                    Model: CmntReply,
                    populate: {
                        path: 'author',
                        model: Profile
                    }
                }]
            }]).sort({'createdAt': -1})
        res.json({
            message: 'Post Created Successfully',
            post: getPost
        }).status(200)

        
    } catch (error) {
        next(error)
    }

}

exports.deletePost = async (req,res,next) => {
    try {
        let profileId = req.profile._id
        let postId = req.body.postId
        let authorId = req.body.authorId;
         
        if(profileId == authorId) {
            let deletePost = await Post.findOneAndDelete({_id: postId})

            if(deletePost) {
                res.json({
                    message: 'Post Deleted Successfully'
                }).status(200)
            }


        }



        
    } catch (error) {
        next(error)
    }
}

exports.getMyPosts = async(req,res,next) => {

    try {
        let profile_id = req.query.profile;

        if(!mongoose.isValidObjectId(profile_id)) return res.json().status(400)
        let posts = await Post.find({author: profile_id}).populate([
            {
                path: 'author',
                model: Profile,
                populate: {
                    path: 'user'
                }
            },
            {
                path: 'comments',
                model: Comment,
                populate:[ {
                    path: 'author',
                    select: ['profilePic','user'],
                    populate: {
                        path: 'user',
                        select: ['firstName','surname']
                    }
                },{
                    path: 'replies',
                    Model: CmntReply,
                    populate: {
                        path: 'author',
                        model: Profile
                    }
                }]
            }]).sort({'createdAt': -1})

        res.json(posts).status(200)
        
    } catch (error) {
        next(error)
    }
}

exports.getSinglePost = async(req,res,next) => {
    console.log('postId')

    try {

        let {postId} = req.query

        let post = await Post.findOne({_id: postId}).populate([
            {
                path: 'author',
                model: Profile,
                populate: {
                    path: 'user'
                }
            },
            {
                path: 'comments',
                model: Comment,
                populate: [{
                    path: 'author',
                    select: ['profilePic','user'],
                    populate: {
                        path: 'user',
                        select: ['firstName','surname']
                    }
                },{
                    path: 'replies',
                    Model: CmntReply,
                    populate: {
                        path: 'author',
                        model: Profile
                    }
                }]
            }
            
        ])

        if(post) {
            return res.json(post).status(200)
        }
        
    } catch (error) {
        console.log(error)
    }
}


exports.getNewsFeed = async(req,res,next) => {
    let profile = req.profile
    let pageNumber = req.query.pageNumber
    let limit = 3
    try {

        let newsFeedPosts = await Post.find().populate([
            {
                path: 'author',
                model: Profile,
                populate: {
                    path: 'user'
                }
            },
            {
                path: 'comments',
                model: Comment,
                populate: [{
                    path: 'author',
                    select: ['profilePic','user'],
                    populate: {
                        path: 'user',
                        select: ['firstName','surname']
                    }
                },{
                    path: 'replies',
                    Model: CmntReply,
                    populate: {
                        path: 'author',
                        model: Profile
                    }
                }]
            }
            
        ]).skip((pageNumber - 1) * limit).limit(limit).sort({'createdAt': -1})

        let nextPosts = await Post.find().skip((pageNumber) * limit).limit(limit).sort({'createdAt': -1})

        let hasNewPost = nextPosts.length == 0 ? false : true
        res.json({posts: newsFeedPosts, hasNewPost}).status(200)
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}



