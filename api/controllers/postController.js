const Post = require('../models/Post')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Comment = require('../models/Comment')
const jwt = require('jsonwebtoken')


exports.createPost = async(req,res,next) => {
    try {
        let profileId = req.profile._id
        let caption = req.body.caption
        let photos =  req.file ? req.file.filename : ''
        let post = new Post({
            caption,
            photos,
            author: profileId

        })

        let savedData = await post.save()
        res.json({
            message: 'Post Created Successfully'
        }).status(200)

        
    } catch (error) {
        next(error)
    }

}

exports.getMyPosts = async(req,res,next) => {

    try {
        let profile_id = req.query.profile;


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
                populate: {
                    path: 'author',
                    select: ['profilePic','user'],
                    populate: {
                        path: 'user',
                        select: ['firstName','surname']
                    }
                }
            }
        ]).sort({'createdAt': -1})

        res.json(posts).status(200)
        
    } catch (error) {
        next(error)
    }
}

exports.getSinglePost = async(req,res,next) => {
    try {

        let profile = req.profile;
        let postId = ''

        let post = await Post.findOne({_id: psotId}).populate({
            path: 'author',
            ref: 'profile',
            populate: {
                path: 'user',
                ref: 'user'
            }
        })
        
    } catch (error) {
        console.log(error)
    }
}


exports.getNewsFeed = async(req,res,next) => {
    let profile = req.profile

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
                populate: {
                    path: 'author',
                    select: ['profilePic','user'],
                    populate: {
                        path: 'user',
                        select: ['firstName','surname']
                    }
                }
            }
        ]).limit(10).sort({'createdAt': -1})

        res.json(newsFeedPosts)
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}



