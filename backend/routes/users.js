const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');
const {User} = require('../model/User');
const {userValidations} = require('../model/User');
const Joi = require('joi');

// get all users
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find().populate('groups.group', 'name avatar');
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error: JSON.stringify(error) });
    }
});

// get user by id
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const userFound = await User.findOne({_id: req.params.userId}).populate('groups.group', 'name avatar');
        if (!userFound) return res.status(404).send({ message: 'No user found!' });
        res.send(userFound);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request' });
    }
});

// update user by id
router.patch('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId});
        if (!user) return res.status(404).send({ message: 'No user found!' });
        
        Object.keys(req.body).forEach(key => {
            if (key !== 'password' && userValidations[key] && !Joi.assert(req.body[key], userValidations[key])) {
                user[key] = req.body[key];
            }
        });

        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// delete user by id
router.delete('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId});
        if (!user) return res.status(404).send({ message: 'No user found!' });
        
        // user should not delete his own id
        if (req.user._id.equals(user._id))  return res.status(400).send({ message: 'User can not delete his/her own ID' });

        await user.remove();
        res.send({ message: `The user bearing id: ${req.params.userId}  has been successfully deleted` });
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

module.exports = router;