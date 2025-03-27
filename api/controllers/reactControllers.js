const Post = require('../models/Post')


exports.postAddReact = async(req,res,next) => {
    try {
    
    let profile = req.profile._id
    let {type,post} = req.body

    await Post.findOneAndUpdate({
        _id: post
    },{
        $pull: {
            reacts: {
                profile: profile,
            }
        }
    },{new: true})

    let addReact = await Post.findOneAndUpdate({
        _id: post
    },{
        $push: {
            reacts: {
                profile,
                type
            }
        }
    
    },{new: true})

    res.json(addReact)
        
    } catch (error) {
        console.log(error)
    }
}

exports.postRemoveReact = async(req,res,next) => {
    try {
        let profile = req.profile._id
        let {post} = req.body

        let removeReact = await Post.findByIdAndUpdate({
            _id: post
        },{
            $pull: {
                reacts: {
                    profile: profile,
                }
            }
        },{new: true})

        return res.json(removeReact)
        
    } catch (error) {
        next(error)
    }
}

exports.addStoryReact = async (req,res,next) => {
    
}
exports.deleteStoryReact = async (req,res,next) => {

}

