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
const authRoute = require('./routes/auth');
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
mongoose.connect(process.env.DATABASE_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('DB is connected!');
});

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
io.on("connection", async (socket) => {
  try {
    // check token validity
    const jwtUserDecoded = jwt.verify(socket.handshake.query.jwt, process.env.TOKEN_SECRET);
    socket.user = await db.users.find(user => jwtUserDecoded._id === user._id);
    socket.user.groups.forEach(group => {
      socket.join(group);
      io.in(group).emit(`WELCOME`, `Hi, I (${socket.user.name}) have joined the ${group}`);
    });
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
        const compiled = JSON.parse(JSON.stringify(chat));
        compiled.author = socket.user;        
        if (!chat.isGroupChat) {
          compiled.recipient = await db.users.find(user => chat.recipient === user._id);
          const isClientOnline = Object.keys(clients).find(client => client === compiled.recipient._id);
          if (isClientOnline) {
            socket.to(clients[isClientOnline]).emit('NEW_CHAT', compiled);
          }
          callback({data: compiled});
        } else {
          compiled.recipient = await db.groups.find(group => chat.recipient === group._id);
          io.in(compiled.recipient._id).emit('NEW_CHAT', compiled);
          callback({data: compiled});
        }
    } catch (error) {
        callback({error});
    }
  });

  socket.on("JOIN_GROUP", async (groupId, callback) => {
    try {
      const group = await db.groups.find(group => groupId === group._id);
      if (group) {
        socket.join(group._id);
        io.in(group._id).emit(`WELCOME`, `Hi, I (${socket.user.name}) have joined the ${group.name}`);
        callback({success: `${socket.user._id} has joined the ${groupId}`});
      } else {
        callback({error: 'No room found!'});
      }
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








