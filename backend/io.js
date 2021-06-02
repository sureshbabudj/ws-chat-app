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
const jwt = require('jsonwebtoken');
// TODO: replace actual db
const db = require('./mock/db.json');
const generateChats = require('./mock/util').generateChats;
const clients = {};
io.on("connection", (socket) => {
  try {
    // check token validity
    socket.user = jwt.verify(socket.handshake.query.jwt, process.env.TOKEN_SECRET);
    clients[socket.user._id] = socket.id;
    console.log( socket.user);
  } catch (error) {
    socket.emit("Error", 'Auth Error');
    socket.disconnect();
    console.log('disconnected!');
}
  socket.on("POST_CHAT", async (chatItem, callback) => {
    try {
        const chat = generateChats(chatItem, socket);
        await db.chats.push(chat);
        let recipient;
        if (!chat.isGroupChat) {
          recipient = await db.users.find(user => chat.recipient === user._id);
        } else {
          recipient = await db.groups.find(group => chat.recipient === group._id);
        }
        const isClientOnline = Object.keys(clients).find(client => client === recipient._id);
        const compiled = JSON.parse(JSON.stringify(chat));
        compiled.author = socket.user;
        compiled.recipient = recipient;
        if (isClientOnline) {
          io.to(clients[isClientOnline]).emit('NEW_CHAT', compiled);
        }
        callback(compiled);
    } catch (error) {
        callback(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.port || 3001;

httpServer.listen(PORT, function () {
    console.log('Express server listening on port ' + PORT)
});








