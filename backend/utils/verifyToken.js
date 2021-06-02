const jwt = require('jsonwebtoken');
const User = require('../model/User');

// TODO: replace actual db
const db = require('../mock/db.json');

module.exports = async function (req, res, next) {
    // check token exist in req header
    const tokenHeader = req.header('authorization');
    if (!tokenHeader) return res.status(401).send({message: 'No Authorization Token Sent!'});

    try {

        // remove bearer
        const token = tokenHeader.split(' ')[1];

        // check token validity
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        
        // check user exists
        const user = await db.users.find(user => user._id === verified._id);
        if (!user) return res.status(401).send({message: 'Invalid user!'});

        req.user = user;

        // go to actual api route
        next();
    } catch (error) {
        res.status(401).send({message: 'Access Denied!'});
    }
   
}