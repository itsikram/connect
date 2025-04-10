const Message = require('../models/Message')
const Profile = require('../models/Profile')
const User = require('../models/User')
module.exports = function messageSocket(io, socket) {

    socket.on('fetchMessages', async (profileId) => {


        let profileContacts = []
        let myProfile = await Profile.findOne({_id: profileId}).populate('friends')


        for (const friendProfile of myProfile.friends) {
            const messages = await Message.find({
                senderId: profileId,
                receiverId: friendProfile._id
            }).limit(1).sort({ timestamp: -1 })
        
            profileContacts.push({ person: friendProfile, messages })
        }
        io.to(profileId).emit('oldMessages', profileContacts)
    })


    socket.on('startChat', async ({ user1, user2 }) => {
        const room = [user1, user2].sort().join('_'); // Ensures consistent room ID
        socket.join(room);

        const messages = await Message.find({ $or: [{ senderId: user1, receiverId: user2 }, { senderId: user2, receiverId: user1 }] }).sort({ timestamp: -1 }).limit(20).populate('parent');
        socket.emit('previousMessages', messages.reverse());
        socket.emit('roomJoined', { room });
    });


    socket.on('loadMessages', async ({ myId, friendId, skip }) => {
        let limit = 20
        console.log('skip', skip)
        if (skip < 1) {
            return io.to(myId).emit('loadMessages', { loadedMessages: [], skip: false })
        }
        const loadedMessages = await Message.find({ $or: [{ senderId: myId, receiverId: friendId }, { senderId: friendId, receiverId: myId }] }).skip(skip).limit(limit).sort({ timestamp: -1 }).populate('parent');
        let messagesLeft = await Message.find({ $or: [{ senderId: myId, receiverId: friendId }, { senderId: friendId, receiverId: myId }] }).skip(skip).limit(limit).sort({ timestamp: -1 })
        let hasNewMessage = messagesLeft.length < 1 ? false : true
        let msgList = loadedMessages.reverse()
        return io.to(myId).emit('loadMessages', { loadedMessages: msgList, hasNewMessage })
    })

    socket.on('deleteMessage', async (messageId) => {
        let deletedMessages = await Message.findOneAndDelete({ _id: messageId });
        if (deletedMessages) {
            io.to(deletedMessages.room).emit('deleteMessage', messageId);
        }
    })


    socket.on('reactMessage', async ({ messageId, profileId }) => {

        let reactedMessage = await Message.findOneAndUpdate({
            _id: messageId, reacts: {
                $nin: profileId
            }
        }, {
            $push: {
                reacts: profileId
            }
        }, { new: true })
        if (reactedMessage) {
            io.to(profileId).emit('messageReacted', messageId)

        }

    })

    socket.on('removeReactMessage', async ({ messageId, profileId }) => {

        let removedReactedMessage = await Message.findOneAndUpdate({ _id: messageId }, {
            $pull: {
                reacts: profileId
            }
        }, { new: true })

        if (removedReactedMessage) {
            io.to(profileId).emit('messageReactRemoved', messageId)

        }

    })

    socket.on('speak_message', async (msgId, friendId) => {
        let msgData = await Message.findById(msgId);
        if (msgData) {
            io.to(friendId).emit('speak_message', msgData.message);
        }
    });

    socket.on('sendMessage', async ({ room, senderId, receiverId, message, attachment, parent }) => {

        let newMessage;
        if (parent == false) {
            newMessage = new Message({ room, senderId, receiverId, message, attachment })
        } else {
            newMessage = new Message({ room, senderId, receiverId, message, attachment, parent })
        }
        await newMessage.save();

        let updatedMessage = await Message.findOne({ _id: newMessage._id }).populate('parent')
        let profileData = await Profile.findById(senderId).populate('user');
        if (!profileData) return;
        let senderName = profileData.user?.firstName + ' ' + profileData.user?.surname;
        let senderPP = profileData.profilePic || 'https://programmerikram.com/wp-content/uploads/2025/03/default-profilePic.png';
        io.to(receiverId).emit('notification', updatedMessage, senderName, senderPP);
        io.to(room).emit('newMessage', updatedMessage);
    });

    socket.on('emotion_change', ({ room, emotion, friendId }) => {
        io.to(friendId).emit('emotion_change', emotion);
    })

    socket.on('typing', ({ room, isTyping, type, receiverId }) => {
        if (isTyping) {
            socket.to(room).emit('typing', { receiverId, isTyping: true, type });
        } else {
            socket.to(room).emit('typing', { receiverId, isTyping: false });
        }
        // socket.to(room).emit('typing');
    }
    );

    socket.on('update_type', ({ room, type }) => {
        io.to(room).emit('update_type', { type });
    })

    socket.on('seenMessage', async (message) => {
        // let msgId = message._id;

        if (message?._id) {
            let msg = await Message.findOneAndUpdate({ _id: message._id }, { isSeen: true }, { new: true });
            if (msg) {
                io.to(message.room).emit('seenMessage', msg);
            }
        }

    });

    // socket.on('update_last_login', async function (userId) {
    //     if (!userId) return;
    //     await User.findOneAndUpdate({ _id: userId }, { lastLogin: new Date(Date.now()).getTime() }, { new: true });
    // })
    // socket.on('is_active', async (data) => {
    //     let isActive = false
    //     let userLastLogin = false;
    //     let profileId = data.profileId
    //     if (profileId && profileId.length < 5) return;
    //     let myId = data.myId

    //     if (profileId) {
    //         let profile = await Profile.findById(profileId).populate('user');

    //         if (profile.user.lastLogin) {
    //             userLastLogin = new Date(profile.user.lastLogin).getTime();
    //         }
    //     }
    //     let currentTime = Date.now()

    //     const diff = Math.abs(userLastLogin - currentTime);
    //     const fiveMinutes = 5 * 60 * 1000;
    //     if (diff > fiveMinutes) {
    //         isActive = false
    //     } else {
    //         isActive = true;
    //     }
    //     // console.log(profileId,isActive);
    //     return io.to(myId).emit('is_active', isActive, userLastLogin, profileId);
    // })

};
