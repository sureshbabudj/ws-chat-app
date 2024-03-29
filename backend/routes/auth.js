const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { User, loginValidation } = require('../model/User');

router.post('/register', async (req, res) => {
    try {
        const validation = await User.validate(req.body);
        if (!validation) {
            // check email already exists
            const emailExist = await User.findOne({ email: req.body.email });
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
            const savedUser = await user.save();
            res.json({id: savedUser.id});
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const validation = await Joi.assert(req.body, loginValidation);
        if (!validation) {

            // check user exists
            const user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(400).send({ message: 'Email or password is wrong!' });

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (!isPasswordValid) return res.status(400).send({ message: 'Invalid password!' });
            
            // assign jwt  TODO: PROCESS REFRESH_TOKEN_SECRET to renew the access token 
            const resUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            };
            const token = jwt.sign(resUser, process.env.TOKEN_SECRET, {expiresIn: 7200});
            res.header('Access-Control-Expose-Headers', '*');
            res.header('Access-Control-Allow-Headers', '*');
            res.header('Authorization', token).send(user);
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
});

module.exports = router;