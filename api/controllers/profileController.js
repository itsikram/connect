const Profile = require('../models/Profile')
const Post = require('../models/Post')


exports.profileGet = async function(req, res, next) {
    let profileId = req.query.profileId
    console.log('pid',profileId)
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
        console.log('pid',profileId)

        let profileData = await Profile.findById(profileId).populate('user')

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
        console.log(bio,updateProfile)

        if(updateProfile){
            res.json(updateProfile)
        }
        
    } catch (error) {
        console.log(error)
    }


}




