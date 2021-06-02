const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');

// TODO: replace actual db
const db = require('../mock/db.json');
const getUserPersonalChats = require('../mock/util').getUserPersonalChats;
const getUserGroupChats = require('../mock/util').getUserGroupChats;
const generateChats = require('../mock/util').generateChats;

// get all users
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await db.users.map(user => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                groups: user.groups
            };
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request' });
    }
});

// get user by id
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const userFound = await db.users.find(user => user._id === req.params.userId);
        if (!userFound) return res.status(404).send({ message: 'No user found!' });
        const { _id, name, email, avatar, groups } = userFound;
        res.send({ _id, name, email, avatar, groups });
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request' });
    }
});

module.exports = router;