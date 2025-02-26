
require('dotenv').config();

const express = require('express')
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI
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

  // Generate a unique room ID using user IDs
  socket.on('startChat', async ({ user1, user2 }) => {
    const room = [user1, user2].sort().join('_'); // Ensures consistent room ID
    socket.join(room);
    console.log(`${user1} and ${user2} joined room: ${room}`);

    const messages = await Message.find({ $or: [{ senderId: user1,receiverId: user2 }, { senderId: user2,receiverId: user1 }] }).sort({ timestamp: 1 }).limit(50);
    socket.emit('previousMessages', messages);

    socket.emit('roomJoined', { room });
  });

  socket.on('sendMessage', async ({ room, senderId, receiverId, message }) => {
    console.log(room, senderId, receiverId, message)
    const newMessage = new Message({ room, senderId, receiverId, message });
    await newMessage.save();
    io.to(room).emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// io.on('connection',(socket) => {

//     console.log(`User Connected ${socket.id}`)

//     socket.on("join_room",(data) => {
//         socket.join(data)
//         console.log(`User with id: ${socket.id} Joined romm: ${data}`)
//     })

//     socket.on('send_message',(data) => {
//         socket.to(data.room).emit("receive_message",data)
//     })


//     socket.on('disconnect',() => {
//         console.log(`User Disconnected ${socket.id}`)
//     })
// })


// Setting up middilewares
middilewares(app)

// setting up routes
routes(app)



app.get('/', async (req, res) => {

  res.json({
    project: 'ics api'
  })
})



mongoose.connect(MONGODB_URI, {}).then(e => {

  httpServer.listen(PORT, (e) => {
    console.log(`Server is running on port ${PORT}`)
  })
}).catch(e => {
  console.log(e)
})

