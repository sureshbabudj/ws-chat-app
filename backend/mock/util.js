// TODO: replace actual db
const db = require('./db.json');

function getUserPersonalChats(userId) {
    let chats = {};
    db.chats.forEach(chat => {
        if (!chat.isGroupChat) {
            if (chat.author === userId) {
                chats[chat.recipient] = chats[chat.recipient] || [];
                chats[chat.recipient].push(chat);
            }
            if (chat.recipient === userId) {
                chats[chat.author] = chats[chat.author] || [];
                chats[chat.author].push(chat);
            }
        }
    });
    // make duplicate
    chats = JSON.parse(JSON.stringify(chats));
    //sort the chats
    Object.keys(chats).forEach(key => {
        chats[key].sort((x, y) => x.sentAt - y.sentAt);
        chats[key].forEach(chat => {
            const author = db.users.find(user => user._id === chat.author);
            chat.author =  {_id: author._id, name: author.name, email: author.email, avatar: author.avatar };
            const recipient = db.users.find(user => user._id === chat.recipient);
            chat.recipient =  {_id: recipient._id, name: recipient.name, email: recipient.email, avatar: recipient.avatar  };
        });
    });
    return chats;
}

function getUserGroupChats(groups) {
    let chats = {};
    db.chats.forEach(chat => {
        if (chat.isGroupChat && groups.includes(chat.recipient)) {
            chats[chat.recipient] = chats[chat.recipient] || [];
            chats[chat.recipient].push(chat);
        }
    });
    // make duplicate
    chats = JSON.parse(JSON.stringify(chats));
    //sort the chats
    Object.keys(chats).forEach(key => {
        chats[key].sort((x, y) => x.sentAt - y.sentAt);
        chats[key].forEach(chat => {
            const author = db.users.find(user => user._id === chat.author);
            chat.author =  {_id: author._id, name: author.name, email: author.email, avatar: author.avatar };
            const recipient = db.groups.find(group => group._id === chat.recipient);
            chat.recipient =  {_id: recipient._id, name: recipient.name, group: true, avatar: recipient.avatar  };
        });
    });
    return chats;
}

function generateChats(payload, req) {
    return chat = {
        "sentAt": payload.sentAt || Date.now(),
        "status": 'unread',
        "message": payload.message,
        "tag": '',
        "author": req.user._id,
        "recipient": payload.recipient,
        "isGroupChat": payload.isGroupChat,
        "_id": `c${Math.floor(Math.random(10) * (10000000 - 100000) + 10000000)}`
    };
}

module.exports = {getUserPersonalChats, getUserGroupChats, generateChats};