const messageController = require('../controllers/messageController')
const Profile = require('../models/Profile')
const User = require('../models/User')
module.exports = function socketHandler(io){

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        let rooms = [socket.handshake.query.profile]
        let homeRoom = rooms[0]

        rooms.map(room => {
            socket.join(room);
        })

        messageController(io,socket)

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

