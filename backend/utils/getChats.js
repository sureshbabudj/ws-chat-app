// TODO: replace actual db
const db = require('../mock/db.json');

function getChats(req, classify = false) {
    let chats;
    if (!classify) {
        chats = db.chats.filter(chat => chat.author === req.user._id || chat.recipient === req.user._id);
    } else {
        const personal = {}, groups = {};
        db.chats.forEach((chat) => {
            if (chat.author === req.user._id || chat.recipient === req.user._id) {
                if (chat.isGroupChat) {
                    if (groups.hasOwnProperty(chat.recipient)) {
                        groups[chat.recipient].chats.push(chat);
                    } else {
                        const group = db.groups.find(grp => grp._id === chat.recipient);
                        if (group) {
                            groups[chat.recipient] = JSON.parse(JSON.stringify(group));
                            groups[chat.recipient].chats =[];
                        } 
                    }
                } else {
                    const isLoggedInUserAuthor = chat.author === req.user._id;
                    const key = isLoggedInUserAuthor ? chat.recipient : chat.author;
                    if (personal.hasOwnProperty(key)) {
                        personal[key].chats.push(chat);
                    } else {
                        const friend = db.users.find(f => f._id === key);
                        if (friend) {
                            personal[key] = JSON.parse(JSON.stringify(friend));
                            personal[key].chats = [];
                        }
                    }
                }
            }
        });
        chats = {personal, groups};
    }
  return chats;
};

module.exports = {getChats}