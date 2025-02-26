const Profile = require('../models/Profile')

exports.postFrndReq = async(req,res,next) => {
    try {
        let myProfile = req.profile
        let profile = req.body.profile
        if(myProfile.friends.includes(profile)){
            
            return res.json({
                message: 'Already Friend'
            })
        }

        let frndProfile = await Profile.findOne({
            _id: profile
        })

        if(frndProfile.friendReqs.includes(myProfile._id)){
            return res.json({
                message: 'Already Requested'
            })
        }

        let frndReq = await Profile.findOneAndUpdate({_id: frndProfile._id},{
            
            $push: {
                friendReqs: myProfile._id
            }
        })

        return res.json(frndReq)

        
    } catch (error) {
        next(error)
    }

}

exports.getFrndReq = async(req,res,next) => {
    try {
        
        let myProfile = req.profile
        let profile = req.query.profile;
        let myProfileReqsId = myProfile.friendReqs
        let getFrndReqsInfo = await Profile.find({
            _id: myProfileReqsId
        }).populate({
            path: 'user',
            select: ['firstName','surname']
        }).select('profilePic')

        return res.status(200).json(getFrndReqsInfo)



    } catch (error) {
        next(error)
    }

}
exports.getProfileFrnd = async(req,res,next) => {

    try {
        let profile = req.query.profile
        let isSingle = req.query.single && req.query.single
        console.log(isSingle)
        if(isSingle){
            let friendData = await profile.findOne({_id:profile})
            return res.json(friendData)
        }
        console.log(req.query.profile)

        let friendProfile = await Profile.findOne({
            _id: profile
        }).select(['friends']).populate({
            path: 'friends',
            select: ['profilePic'],
            populate: {
                path: 'user',
                select: ['firstName','surname']
            }
        })

        let friendsData = friendProfile.friends? friendProfile.friends : {message: 'No Friends Found'}
        res.json(friendsData)


    } catch (error) {
        next(error)
    }

}

exports.getProfileSuggetions = async(req,res,next) => {
    try {

        let profile = req.profile
        let myFriends = req.profile.friends

        let getFrndSuggetions = await Profile.find({
            _id: {
                "$nin": myFriends,
                "$ne": profile._id
            },
        }).populate('user')

        res.json(getFrndSuggetions)
        console.log(getFrndSuggetions,myFriends)
        
    } catch (error) {
        next(error)
    }
}



exports.postFrndAccept = async(req,res,next) => {
    try {
        let profile = req.body.profile
        let myProfile = req.profile

        let updateFrndProfile = await Profile.findOneAndUpdate({
            _id: profile
        },{
            $push: {
                friends: myProfile._id
            }
        })

        let updateMyProfile = await Profile.findByIdAndUpdate({
            _id: myProfile._id
        },{
            $push: {
                friends: profile
            },
            $pull: {
                friendReqs: profile
            }
        })


        return res.status(200).json({
            message:'Friend Request Accepted'
        })


       
    
    } catch (error) {
        next(error)
    }


}

exports.postFrndDelete = async(req,res,next)=> {
    try {
        let friendProfileId = req.body.profile
        let myProfile = req.profile

        let updateMyProfile = await Profile.findOneAndUpdate({
            _id: myProfile._id
        },{
            $pull : {
                friendReqs: friendProfileId
            }
        },{new: true})

        res.json(updateMyProfile)

    } catch (error) {
        next(error)
    }

}

exports.postRemoveFrndReq = async(req,res,next) => {
    try {
        let frndProfileId = req.body.profile
        let myProfile = req.profile

        let updateFrnd = await Profile.findOneAndUpdate({
            _id: frndProfileId
        },{
            $pull: {
                friendReqs: myProfile._id
            }
        },{new: true})
        res.json(updateFrnd)
        
    } catch (e) {
        next(e)
    }
}

exports.postRemoveFrnd = async(req,res,next) => {
    try {

        let myProfile = req.profile
        let frndProfile = req.body.profile || ''



        let updateMyProfile = await Profile.findOneAndUpdate({
            _id: myProfile._id
        },{
            $pull: {
                friends: frndProfile
            }
        })

        let updateFrndProfile = await Profile.findByIdAndUpdate({
            _id: frndProfile
        },{
            $pull: {
                friends: myProfile._id
            }
        })

        if (updateMyProfile && updateFrndProfile){

            return res.json({
                message: 'Friend removed From your profile'
            })
        }
        
    } catch (error) {
        next(error)
    }
}
