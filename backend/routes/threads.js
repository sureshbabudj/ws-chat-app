const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');

// TODO: replace actual db
const db = require('../mock/db.json');
const getUserPersonalChats = require('../mock/util').getUserPersonalChats;
const getUserGroupChats = require('../mock/util').getUserGroupChats;
const generateChats = require('../mock/util').generateChats;

// get all user conversations
router.get('/', verifyToken, async (req, res) => {
    try {
        const chats = getUserPersonalChats(req.user._id);
        // send the latest chat in this response
        const compiled = [];
        Object.keys(chats).forEach((key, i) => {
            const latestChat = JSON.parse(JSON.stringify(chats[key][chats[key].length - 1]));
            latestChat.count = chats[key].filter(chat => chat.status === 'unread').length;
            compiled.push(latestChat);
        });
        return res.send(compiled);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// get user's conversations with a specific person
router.get('/:friendId', verifyToken, async (req, res) => {
    try {
        const friendId = req.params.friendId;
        const friendFound = db.users.find(user => user._id === friendId);
        if (!friendFound) return res.status(404).send({ message: 'No user or recipient found!' });
        
        const chats = getUserPersonalChats(req.user._id);
        res.send(chats[friendId] || []);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }

});

module.exports = router;