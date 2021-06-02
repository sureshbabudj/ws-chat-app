const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');

// TODO: replace actual db
const db = require('../mock/db.json');

// search
router.get('/', verifyToken, async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const resource = req.query.resource;
        let usersFound = [], groupsFound = [];

        if (!resource || (resource && resource.toLowerCase() === 'all') ) { // get user and group
            usersFound = await db.users.filter(user => user.name.toLowerCase().trim().includes(keyword.toLowerCase().trim()) === true);
            groupsFound = await  db.groups.filter(group => group.name.toLowerCase().trim().includes(keyword.toLowerCase().trim()));
        } else if (resource.toLowerCase() === 'user') { // get only user
            usersFound = await  db.users.filter(user => user.name.toLowerCase().trim().includes(keyword.toLowerCase().trim()) === true);
        } else if (resource.toLowerCase() === 'group') { // get only group
            groupsFound = await db.groups.filter(group => group.name.toLowerCase().trim().includes(keyword.toLowerCase().trim()));
        }    

        const all = [...usersFound, ...groupsFound];
        if (!all.length) return res.status(404).send({message: 'No resource found!'});

        res.send(all);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request' });
    }
    
});

module.exports = router;
