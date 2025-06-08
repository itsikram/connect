

require('dotenv').config();
const express = require('express')
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const MONGODB_URI = process.env.NODE_ENV == 'production' ? process.env.PROD_MONGODB_URI : process.env.DEV_MONGODB_URI;
mongoose.set('strictQuery', false)
mongoose.set('strictPopulate', false);
const socketIo = require('socket.io');
const { createServer } = require('http')
const cors = require('cors');
const middilewares = require('./middlewares/middlewares')
const routes = require('./Routes/routes')
let app = express();
const socketHandler = require('./sockets/socketHandler')
const httpServer = createServer(app)
const path = require('path');






app.use(cors());


const io = socketIo(httpServer, {
  cors: {
    origin: "*", // Allow frontend access
    methods: ["GET", "POST"]
  }
});
socketHandler(io)

// Setting up middilewares
middilewares(app)

// setting up routes
routes(app)


app.set('io',io)

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.get('/', async (req, res) => {
//   return res.json({ message: 'workign fine' });
// })

// Root route should serve index.html

mongoose.connect(process.env.PROD_MONGODB_URI, {}).then(e => {

  httpServer.listen(PORT, (e) => {
    console.log(`Server is running on port ${PORT}`)
  })
}).catch(e => {
  console.log(e)
})




