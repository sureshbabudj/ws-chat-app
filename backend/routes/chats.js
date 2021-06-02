const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');
const getChats = require('../utils/getChats').getChats;

// TODO: replace actual db
const db = require('../mock/db.json');
const getUserPersonalChats = require('../mock/util').getUserPersonalChats;
const getUserGroupChats = require('../mock/util').getUserGroupChats;
const generateChats = require('../mock/util').generateChats;

// get all chats
router.get('/', verifyToken, async (req, res) => {
    try {
        // send only logged in user chats
        const chats = getChats(req);
        res.send(chats);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }

});

// get all chats with filters
router.get('/classify', verifyToken, async (req, res) => {
    const chats = getChats(req, true)
    try {
        // send only logged in user chats
        
        res.send(chats);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }

});

// create chat
router.post('/', verifyToken, async (req, res) => {
    const payload = req.body;
    try {
        const chat = generateChats(payload, req);
        await db.chats.push(chat);
        res.send(chat);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// get chat by id
router.get('/:chatId', verifyToken, async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const chatFound = await db.chats.find(chat => chat._id === chatId && (chat.author === req.user._id || chat.recipient === req.user._id));
        if (!chatFound) return res.status(404).send({message: 'No chat found!'});
        res.send(chatFound);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    } 
});

module.exports = router;