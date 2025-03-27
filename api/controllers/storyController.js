const Story = require('../models/Story')
const Profile = require('../models/Profile')
const Comment = require('../models/Comment')



exports.postStory = async(req,res,next) => {
    try {
        let profileId = req.profile._id
        let image = req.body.image
        let story = new Story({
            image,
            author: profileId
        })

        let savedData = await story.save()
        if(savedData) {
            res.json({
                message: 'Story Created Successfully'
            }).status(200)
        }
        
    } catch (error) {
        next(error)
    }

}

exports.deleteStory = async (req,res,next) => {
    try {
        let profileId = req.profile._id
        let storyId = req.body.storyId
        let authorId = req.body.authorId;
         
        if(profileId == authorId) {
            let deleteStory = await Story.findOneAndDelete({_id: storyId})

            if(deleteStory) {
                res.json({
                    message: 'Story Deleted Successfully'
                }).status(200)
            }
        }

    } catch (error) {
        next(error)
    }
}

exports.getMyStories = async(req,res,next) => {

    try {
        let profile_id = req.query.profile;


        let stories = await Story.find({author: profile_id}).populate([
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

        res.json(stories).status(200)
        
    } catch (error) {
        next(error)
    }
}

exports.getSingleStory = async(req,res,next) => {
    try {

        let storyId = req.query.storyId;

        let story = await Story.findById(storyId).populate([
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
        console.log('s id',storyId,story)

        return res.json(story).status(200)

        
    } catch (error) {
        console.log(error)
    }
}


exports.getAllStories = async(req,res,next) => {

    try {
        let newsFeedStories = await Story.find().populate([
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

        res.json(newsFeedStories).status(200)
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}



