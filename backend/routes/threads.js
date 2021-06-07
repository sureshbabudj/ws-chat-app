const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');
const {Chat} = require('../model/Chat');
const {User} = require('../model/User');
const Group = require('../model/Group');

// get all user conversations
router.get('/direct', verifyToken, async (req, res) => {
    try {
         // send only logged in user chats with friends
         const query = {
            recipient: { $exists: true },
            $or: [{author: req.user.id}, {recipient: req.user.id}],
            sentAt: { 
                $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)  // 2 day filter 
            }
         };
        const chats = await Chat.find(query).populate('recipient author', '_id name avatar');
        const threads = {};
        chats.forEach(chat => {
            const loggedInUser = req.user._id.toString();
            const author = chat.author._id.toString();
            const recipient = chat.recipient._id.toString();
            if (author === loggedInUser) {
                threads[recipient] = threads[recipient] || [];
                threads[recipient].push(chat);
            } else {
                threads[author] = threads[author] || [];
                threads[author].push(chat);
            }
        });
        return res.send(threads);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// get logged in user's all groups conversations
router.get('/group', verifyToken, async (req, res) => {
    try {
        const groups = req.user.groups.map(i => i.group.toString());
        const query = {
            group: { $exists: true, $in: groups },
            sentAt: { 
                $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)  // 2 day filter 
            }
         };
        const chats = await Chat.find(query).populate('group author', '_id name avatar');
        const threads = {};
        groups.forEach(i => threads[i] = []);
        chats.forEach(chat => {
            const group = chat.group._id.toString();
            threads[group] = threads[group] || [];
            threads[group].push(chat);
        });
        res.send(threads);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// get user's conversations with a specific person
router.get('/direct/:friendId', verifyToken, async (req, res) => {
    try {
        const friend = await User.findOne({_id: req.params.friendId});
        if (!friend) return res.status(404).send({ message: 'No user found!' });

        // send only logged in user chats with the passed user id (friend)
        const query = { 
            $or: [
                { $and: [{author: req.user._id}, {recipient: friend._id}] },
                { $and: [{author: friend._id}, {recipient: req.user._id}] }
            ],
            sentAt: {
                $gt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)  // 3 day filter
            }
        };

        const chats = await Chat.find(query).sort({'sentAt': 'asc'}).populate('recipient author group', '_id name avatar');;
        res.send(chats);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// get logged in user's particular group's conversations
router.get('/group/:groupId', verifyToken, async (req, res) => {
    try {
        const group = await Group.findOne({_id: req.params.groupId});
        if (!group) return res.status(404).send({ message: 'No group found!' });

        // send only group chats if loggedIn user is a member
        const isMember = req.user.groups.find(userGroup => userGroup.group.equals(group._id));
        if (!isMember) return res.status(400).send({ message: 'The user is not part of the group'});

        const query = { 
            group: group._id,
            sentAt: {
                $gt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)  // 3 day filter
            }
        };

        const chats = await Chat.find(query).sort({'sentAt': 'asc'}).populate('recipient author group', '_id name avatar');;
        res.send(chats);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

module.exports = router;