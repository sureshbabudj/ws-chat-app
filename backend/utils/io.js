const jwt = require('jsonwebtoken');
const {User} = require('../model/User');
const {Chat} = require('../model/Chat');
const Group = require('../model/Group');
const postChat = require('./postChat').postChat;
const clients = {};

const socketFn = async function(httpServer) {
    const io = require("socket.io")(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    io.on("connection", async function (socket) {
        try {
            // check token validity
            const jwtUserDecoded = jwt.verify(socket.handshake.query.jwt, process.env.TOKEN_SECRET);
            socket.user = await User.findOne({ _id: jwtUserDecoded._id });
            socket.groupIds = [];
            socket.user.groups.forEach(group => {
                const groupId = group.group._id.toString();
                socket.join(groupId);
                io.in(groupId).emit(`WELCOME`, `Hi, I (${socket.user.name}) have joined the ${groupId}`);
                socket.groupIds.push(groupId);
            });
            socket.userId = socket.user._id.toString();
            clients[socket.userId] = socket.id;
            console.log(clients);
        } catch (error) {
            socket.emit("Error", 'Auth Error');
            socket.disconnect();
            console.log("Client disconnected: " + socket.userId);
        }

        socket.on("POST_CHAT", async function (chatItem, callback) {
            try {
                const chat = await postChat({ body: chatItem, user: socket.user });
                const compiled = await Chat.findOne({ _id: chat._id }).populate('recipient author group', '_id name avatar');
                if (!chat.toObject().hasOwnProperty('group')) {
                    const isClientOnline = Object.keys(clients).find(client => client === compiled.recipient._id.toString());
                    if (isClientOnline) {
                        socket.to(clients[isClientOnline]).emit('NEW_CHAT', compiled);
                    }
                    callback({ data: compiled });
                } else {
                    const groupId = compiled.group._id.toString();
                    io.in(groupId).emit('NEW_CHAT', compiled);
                    callback({ data: compiled });
                }
            } catch (error) {
                callback({ error });
            }
        });

        socket.on("JOIN_GROUP", async function (groupId, callback) {
            try {
                const group = await Group.findOne({_id: groupId});
                if (group) {
                    socket.join(group._id.toString());
                    io.in(group._id).emit(`WELCOME`, `Hi, I (${socket.user.name}) have joined the ${group.toObject().name}`);
                    callback({ success: `${socket.userId} has joined the ${groupId}` });
                } else {
                    callback({ error: 'No room found!' });
                }
            } catch (error) {
                callback(error);
            }
        });

        socket.on("disconnect", () => {
            try {
                delete clients[socket.userId];
                console.log("Client disconnected: " + socket.userId);
            } catch (error) {
                console.error({error});
            }
            
        });
    });
}

module.exports.socketFn = socketFn;