const messageSocket = require('./messageSocket')
const { notificationSocket } = require('../controllers/notificationController')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Post = require('../models/Post')
// const faceapi = require('face-api.js');
// const canvas = require('canvas');
// const { Canvas, Image, ImageData } = canvas;// const tf = require('@tensorflow/tfjs-node');

// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
module.exports = function socketHandler(io) {

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        let rooms = [socket.handshake.query.profile]

 
        socket.on('viewPost', async({ visitorId, postId }) => {
            let viewedPost = await Post.findOneAndUpdate({
                _id: postId,
                viewers: {$ne: visitorId}
            },{
                $push: {
                    viewers: visitorId
                }
            })
            return viewedPost

        })


        socket.on('bump', (friendProfile, myProfile) => {
            io.to(friendProfile._id).emit('bumpUser', friendProfile, myProfile)
        })

        socket.on('call-user', (data) => {

            io.to(data.userToCall).emit('receive-call', {
                signal: data.signalData,
                from: data.from,
                name: data.name,
                isVideo: data.isVideo
            });
        });

        socket.on('answer-call', (data) => {
            io.to(data.to).emit('call-accepted', data.signal);

        });


        socket.on('leaveVideoCall', friendId => {
            io.to(friendId).emit('videoCallEnd', friendId)
        })

        let homeRoom = rooms[0]
        rooms.map(room => {
            socket.join(room);
        })

        messageSocket(io, socket)
        notificationSocket(io, socket, profileId = homeRoom)

        socket.on('update_last_login', async function (userId) {
            if (!userId) return;
            await User.findOneAndUpdate({ _id: userId }, { lastLogin: new Date(Date.now()).getTime() }, { new: true });
        })
        socket.on('is_active', async (data) => {
            let isActive = false
            let userLastLogin = false;
            let profileId = data.profileId
            if (profileId && profileId.length < 5) return;
            let myId = data.myId

            if (profileId) {
                let profile = await Profile.findById(profileId).populate('user');

                if (profile.user.lastLogin) {
                    userLastLogin = new Date(profile.user.lastLogin).getTime();
                }
            }
            let currentTime = Date.now()

            const diff = Math.abs(userLastLogin - currentTime);
            const fiveMinutes = 5 * 60 * 1000;
            if (diff > fiveMinutes) {
                isActive = false
            } else {
                isActive = true;
            }
            // console.log(profileId,isActive);
            return io.to(myId).emit('is_active', isActive, userLastLogin, profileId);
        })

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });

    });
}

