const Profile = require('../models/Profile')
const Post = require('../models/Post')
const Story = require('../models/Story')



exports.prefileHasStory = async function(req, res, next) {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    let profileId = req.query.profileId
    let hasStory = await Story.exists({author: profileId ,createdAt: { $gte: twentyFourHoursAgo }})
    if(hasStory == null) {
        return res.json({'message': 'Story Not Available','hasStory': 'no'}).status(200)

    }else {
        return res.json({'message': 'Story Available','hasStory': 'yes'}).status(200)

    }
    return next()

}
exports.profileGet = async function(req, res, next) {
    let profileId = req.query.profileId
    if(profileId == false) return;

    let profileData = await Profile.findById(profileId).populate('user')
    if(profileData) {
        return res.json(profileData)
    }else {
        return next()

    }
    return next()

}

exports.profilePost = async(req,res,next) => {

    try {
        let profileId = req.body.profile
        if(profileId == false) return;

        let profileData = await Profile.findById(profileId).populate(['friends','user'])
        if(profileData) {
            return res.json(profileData)
        }

    } catch (error) {
        console.log(error)
    }

}
exports.updateCoverPost = async(req,res,next)=> {

    let profileId = req.body.profile
    let coverPicUrl = req.body.coverPicUrl
    try {
        let updateProfile = await Profile.findOneAndUpdate({_id: profileId},{
            coverPic: coverPicUrl
        })
        res.json(updateProfile)



        
    } catch (error) {
        console.log(error)
    }

    
}

exports.updateProfilePic = async(req,res,next) => {
    let profileId = req.profile._id;
    let profilePicUrl = req.body.profilePicUrl
    let caption = req.body.caption
    let type = req.body.type || 'post'


    try {

        let post = new Post({
            type,
            caption,
            photos: profilePicUrl,
            author: profileId
        })

        let savedPost = await post.save()

        let updatedProfile = await Profile.findByIdAndUpdate({_id: profileId},{
            profilePic: profilePicUrl
        },{new: true})

        if(savedPost && updatedProfile) {
            return res.json(updatedProfile)
        }
        
    } catch (error) {
        console.log(error)
    }
}

exports.updateBioPost = async(req,res,next) => {
    try {

        let bio = req.body.bio
        let updateProfile = await Profile.findByIdAndUpdate({
            _id: req.profile._id
        },{
            bio
        },{new: true})

        if(updateProfile){
            res.json(updateProfile)
        }
        
    } catch (error) {
        console.log(error)
    }


}




