
require('dotenv').config();

const path = require("path");
const express = require('express')
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const MONGODB_URI = process.env.NODE_ENV == 'production' ?  process.env.PROD_MONGODB_URI : process.env.DEV_MONGODB_URI;
mongoose.set('strictQuery', false)
const socketIo = require('socket.io');

const { createServer } = require('http')
const cors = require('cors');
const middilewares = require('./middlewares/middlewares')
const routes = require('./Routes/routes')
let app = express();
const httpServer = createServer(app)

app.use(cors());

const io = socketIo(httpServer, {
  cors: {
    origin: "*", // Allow frontend access
    methods: ["GET", "POST"]
  }
});

const MessageSchema = new mongoose.Schema({
  room: String,
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  let rooms = [socket.handshake.query.profile]
  let homeRoom = rooms[0]

  console.log('User connected with Profile ID:', );

  rooms.map(room =>{
    socket.join(room);
  })

  // Generate a unique room ID using user IDs
  socket.on('startChat', async ({ user1, user2 }) => {
    const room = [user1, user2].sort().join('_'); // Ensures consistent room ID
    socket.join(room);

    const messages = await Message.find({ $or: [{ senderId: user1,receiverId: user2 }, { senderId: user2,receiverId: user1 }] }).sort({ timestamp: 1 }).limit(1000);
    socket.emit('previousMessages', messages);

    socket.emit('roomJoined', { room });
  });

  socket.on('deleteMessage',async( messageId) => {
    let deletedMessages = await Message.findOneAndDelete({_id: messageId});
    if(deletedMessages) {
      console.log(deletedMessages)
      socket.emit('deleteMessage',messageId);
    }
  })

  socket.on('sendMessage', async ({ room, senderId, receiverId, message }) => {
    console.log(room, senderId, receiverId, message)
    const newMessage = new Message({ room, senderId, receiverId, message });
    await newMessage.save();
    io.to(receiverId).emit('notification', newMessage);
    io.to(room).emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});



// Setting up middilewares
middilewares(app)

// setting up routes
routes(app)


app.get('/', async (req, res) => {
  return res.json({message: 'workign fine'});
})

// Root route should serve index.html

mongoose.connect(process.env.PROD_MONGODB_URI, {}).then(e => {

  httpServer.listen(PORT, (e) => {
    console.log(`Server is running on port ${PORT}`)
  })
}).catch(e => {
  console.log(e)
})

