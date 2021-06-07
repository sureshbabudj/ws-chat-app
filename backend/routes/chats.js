const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');
const {Chat, chatValidations} = require('../model/Chat');
const {User} = require('../model/User');
const Group = require('../model/Group');
const Joi = require('joi');

const postChat = require('../utils/postChat').postChat;

// TODO: replace actual db
const db = require('../mock/db.json');



// get all chats
router.get('/', verifyToken, async (req, res) => {
    try {
        // send only logged in user chats
        const Query = { 
            $or: [{ 
                author: req.user._id 
            }, {
                recipient: req.user._id 
            }],
            sentAt: {
                $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)  // 1 day filter
            }
        };
        
        
        const chats = await Chat.find(Query).populate('recipient author group', '_id name avatar');
        res.send(chats);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});



// create chat
router.post('/', verifyToken, async (req, res) => {
    try {
        const chat = await postChat(req);
        res.send(chat);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// get chat by id
router.get('/:chatId', verifyToken, async (req, res) => {
    try {
        const Query = Chat.findOne(
            { 
                $or: [{ 
                    author: req.user._id 
                }, {
                    recipient: req.user._id 
                }],
                _id: req.params.chatId
            }
        );
        const chat = await Query.populate('recipient author group', '_id name avatar');
        if (!chat) return res.status(404).send({message: 'No chat found!'});

        res.send(chat);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    } 
});

// update chat by id
router.patch('/:chatId', verifyToken, async (req, res) => {
    try {
        const chat = await Chat.findOne(
            { 
                $or: [{ 
                    author: req.user._id 
                }, {
                    recipient: req.user._id 
                }],
                _id: req.params.chatId
            }
        );
        if (!chat) return res.status(404).send({message: 'No chat found!'});
        if (!chat.author.equals(req.user._id)) return res.status(400).send({message: 'You are not the author to update the chat'});

        Object.keys(req.body).forEach(key => {
            if (key !== 'group' && key !== 'recipient' && chatValidations[key] &&  !Joi.assert(req.body[key], chatValidations[key])) {
                chat[key] = req.body[key];
            }
        });

        chat.updatedAt = new Date(Date.now()).toISOString();

        await chat.save();

        res.send(chat);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    } 
});

// delete chat by id
router.delete('/:chatId', verifyToken, async (req, res) => {
    try {
        const chat = await Chat.findOne(
            { 
                $or: [{ 
                    author: req.user._id 
                }, {
                    recipient: req.user._id 
                }],
                _id: req.params.chatId
            }
        );
        if (!chat) return res.status(404).send({message: 'No chat found!'});
        if (!chat.author.equals(req.user._id)) return res.status(400).send({message: 'You are not the author to delete the chat'});

        await chat.remove();
        res.send({ message: `The chat bearing id: ${req.params.chatId} has been successfully deleted` });
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    } 
});

module.exports = router;