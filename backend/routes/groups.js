const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');

// TODO: replace actual db
const db = require('../mock/db.json');
const getUserPersonalChats = require('../mock/util').getUserPersonalChats;
const getUserGroupChats = require('../mock/util').getUserGroupChats;
const generateChats = require('../mock/util').generateChats;

// get all groups
router.get('/', verifyToken, async (req, res) => {
    try {
        const groups = await db.groups.map(group => {
            const info = {
                _id: group._id,
                name: group.name,
                members: group.members,
                avatar: group.avatar
            };
            return info;
        });
        res.send(groups);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request' });
    }

});

// get all user groups
router.get('/:groupId', verifyToken, async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // check if group exist
        let group = await db.groups.find(g => g._id === groupId);
        if (!group) res.status(400).send({ message: `Group: ${groupId} is not found!` });

        // send the latest chat in this response
        const isLoggedUserMemberOfGroup = req.user.groups.includes(groupId);

        if (isLoggedUserMemberOfGroup) {
            const chats = getUserGroupChats([groupId]);
            group.chats = chats[groupId] || [];
        }
        
        res.send(group || []);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request' });
    }
});

// get all user groups
router.get('/user/:userId', verifyToken, async (req, res) => {
    try {

        // check the user
        const userFound = await db.users.find(user => user._id === req.params.userId);
        if (!userFound) return res.status(404).send({ message: 'No user found!' });

        // get user's groups
        const groups = userFound.groups.map((groupId) => db.groups.find((group) => group._id === groupId));
        // send group info without chats for other user
        if (req.user._id !== req.params.userId) return res.send(groups);

        // get group's chats
        let chats = getUserGroupChats(userFound.groups);
        chats = JSON.parse(JSON.stringify(chats));

        const latest = req.query.all !== 'true';
        if (latest) {
            // send the latest chat in this response
            Object.keys(chats).forEach((key, i) => {
                const latestChat = chats[key][chats[key].length - 1];
                latestChat.count = chats[key].filter(chat => chat.status === 'unread').length;
                chats[key] = [latestChat];
            });
        }
        groups.forEach(group => group.chats = chats[group._id] || []);
        res.send(groups || []);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

module.exports = router;