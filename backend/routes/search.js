const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');
const {User} = require('../model/User');
const Group = require('../model/Group');

// search
router.get('/', verifyToken, async (req, res) => {
    try {

        if (!req.query.keyword) {
            return res.status(400).send({ message: 'Oops! Send the keyword to search for the resources' });
        }
        const keyword = req.query.keyword;
        const resource = req.query.resource;

        const regex = new RegExp(keyword);  // 'i' makes it case insensitive
    
        let usersFound = [], groupsFound = [];
        const query = {
            $or: [ 
                { name : { $regex: keyword, $options: 'i' }},
                { email: { $regex: keyword, $options: 'i' } }
            ]
        };

        if (!resource || (resource && resource.toLowerCase() === 'all') ) { // get user and group
            usersFound = await User.find(query);
            groupsFound = await Group.find({ name : { $regex: keyword, $options: 'i' }});
        } else if (resource.toLowerCase() === 'user') { // get only user
            usersFound = await User.find(query);
        } else if (resource.toLowerCase() === 'group') { // get only group
            groupsFound = await Group.find({ name : { $regex: keyword, $options: 'i' }});
        } else {
            return res.status(400).send({ message: 'Oops! Send the resource as either group or user' });
        }  

        const all = [...usersFound, ...groupsFound];
        if (!all.length) return res.status(404).send({message: 'No resource found!'});

        res.send(all);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request' });
    }
    
});

module.exports = router;
