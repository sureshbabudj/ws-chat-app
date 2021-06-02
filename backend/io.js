const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv/config');

// app
const app = express();
app.use(cors());
app.use(express.json());

// home
app.get('/', (req, res) => {
    res.send({message: 'Welcome'});
});

// routes
const authRoute = require('./routes/auth_dummy');
app.use('/api/auth', authRoute);

const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);

const threadsRoute = require('./routes/threads');
app.use('/api/threads', threadsRoute);

const searchRoute = require('./routes/search');
app.use('/api/search', searchRoute);

const groupsRoute = require('./routes/groups');
app.use('/api/groups', groupsRoute);

const chatsRoute = require('./routes/chats');
app.use('/api/chats', chatsRoute);

// DB connection
// mongoose.connect(process.env.DATABASE_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
//     console.log('DB is connected!');
// });

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

const getChats = require('./utils/getChats').getChats;
const getApiAndEmit = (socket) => {
  try {
    const response = getChats(socket, true);
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
  } catch (error) {
    // Emitting a new message. Will be consumed by the client
    socket.emit("Error", error);
  }
}

const jwt = require('jsonwebtoken');
let interval;
io.on("connection", (socket) => {
  try {
    // check token validity
    socket.user = jwt.verify(socket.handshake.query.jwt, process.env.TOKEN_SECRET);
    console.log( socket.user);
  } catch (error) {
    socket.emit("Error", 'Auth Error');
    socket.disconnect();
    console.log('disconnected!');
    clearInterval(interval);
  }
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const PORT = process.env.port || 3001;

httpServer.listen(PORT, function () {
    console.log('Express server listening on port ' + PORT)
});








