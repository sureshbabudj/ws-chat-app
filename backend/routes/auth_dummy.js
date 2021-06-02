const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// TODO: replace actual db
const db = require('../mock/db.json');
const getUserPersonalChats = require('../mock/util').getUserPersonalChats;
const getUserGroupChats = require('../mock/util').getUserGroupChats;
const generateChats = require('../mock/util').generateChats;

router.post('/register', async (req, res) => {
    try {
        // check email already exists
        const emailExist = await db.users.find(user => user.email === req.body.email);
        if (emailExist) return res.status(400).send({ message: 'Email already exists!' });

        // bcrypt password while storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        //save user
        const savedUser = await db.users.push(users);
        res.json({id: savedUser.id});
    } catch (error) {
        res.status(400).send({ message: error });
    }
});

router.post('/login', async (req, res) => {
    try {
        // check user exists
        const user = await db.users.find(user => user.email === req.body.email);
        if (!user) return res.status(400).send({ message: 'Email or password is wrong!' });

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) return res.status(400).send({ message: 'Invalid password!' });
        
        // assign jwt  TODO: PROCESS REFRESH_TOKEN_SECRET to renew the access token 
        const matchedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        };
        const token = jwt.sign(matchedUser, process.env.TOKEN_SECRET, {expiresIn: 1800});
        res.header('Access-Control-Expose-Headers', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Authorization', token).json(matchedUser);
    } catch (error) {
        res.status(400).send({ message: error });
    }
});

module.exports = router;