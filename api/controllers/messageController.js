const Message = require('../models/Message')


exports.removeMessageReact = async (req, res, next) => {
    try {
        let io = req.app.get('io')
        let messageId = req.body.messageId
        let myId = req.body.myId

        let message = await Message.findOne({ _id: messageId })

        if (message) {
            let reactRemovedMessage = await Message.findOneAndUpdate({
                _id: messageId
            },{
                $pull: {
                    reacts: myId
                }
            },{new: true})

            if(reactRemovedMessage) {
                let receverId = message.receiverId == myId ? message.senderId : message.receiverId
                io.to(receverId).emit('messageReactRemoved', messageId)

                return res.json({message: 'Message React Removed'}).status(200)
            }
        }
        return res.json({message: 'Message React Removing Failed'}).status(400)

    } catch (error) {
        next(error)
    }
}
exports.addMessageReact = async (req, res, next) => {

    try {
        let io = req.app.get('io')
        let messageId = req.body.messageId
        let myId = req.body.myId

        let message = await Message.findOne({ _id: messageId })

        if (message) {
            let reactedMessage = await Message.findOneAndUpdate({
                _id: messageId, reacts: {
                    $nin: myId
                }
            }, {
                $push: {
                    reacts: myId
                }
            }, { new: true })


            if(reactedMessage) {
                let receverId = message.receiverId == myId ? message.senderId : message.receiverId
                io.to(receverId).emit('messageReacted', messageId)

                return res.json({message: 'Message React Added'}).status(200)
            }
        }
        return res.json({message: 'Message React Adding Failed'}).status(400)

    } catch (error) {
        next(error)
    }

}

exports.getMedia = async(req,res,next) => {

    try {
        const fileUrlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
        let getMessages = await Message.find({
            $or: [
                { senderId: req.profile._id, receiverId: req.query.profileId },
                { senderId: req.query.profileId, receiverId: req.profile._id }
            ],
            attachment: { $regex: fileUrlRegex }
        }).sort({ createdAt: -1 }).limit(10)

        res.json(getMessages).status(200)
        
    } catch (error) {
        next(error)
        
    }
}



// Generate a unique room ID using user IDs
