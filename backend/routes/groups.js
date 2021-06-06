const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');
const Group = require('../model/Group');
const {User} = require('../model/User');

// TODO: replace actual db
const db = require('../mock/db.json');
const getUserGroupChats = require('../mock/util').getUserGroupChats;


// get all groups
router.get('/', verifyToken, async (req, res) => {
    try {
        const groups = await Group.find().populate('members.member', 'name email avatar');
        res.send(groups);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request' });
    }
});

// create a new group
router.post('/', verifyToken, async (req, res) => {
    try {
        const validation = await Group.validate(req.body);
        if (!validation) {

            // check name already exists
            const groupExist = await Group.findOne({ name: req.body.name });
            if (groupExist) return res.status(400).send({ message: 'Group Name already exists!' });

            const group = new Group({
                name: req.body.name,
                members: [{ member: req.user._id, role: 'admin' }]
            })
            const redo =  await Group.validate(req.body);
            if (!redo) {
                //save group
                const savedGroup = await group.save();
                // link group to user info 
                req.user.groups.push({group: savedGroup._id, role: 'admin'});
                await req.user.save();

                res.send(savedGroup);
            }
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
});

// get group by id
router.get('/:groupId', verifyToken, async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // check if group exist
        let group = await Group.findOne({_id: groupId}).populate('members.member', 'name email avatar');
        if (!group) res.status(400).send({ message: `Group: ${groupId} is not found!` });

        // send the latest chat in this response
        const isLoggedUserMemberOfGroup = group.members.find(i => i.member._id.equals(req.user._id));

        if (isLoggedUserMemberOfGroup) {
            const chats = getUserGroupChats([groupId]);
            group = group.toObject();
            group.chats = chats[groupId] || [];
        }
        
        res.send(group);
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// update group by id
router.patch('/:groupId', verifyToken, async (req, res) => {
    try {

        const validation = await Group.validate(req.body);
        if(!validation) {
            const groupId = req.params.groupId;

            // check if group exist
            let group = await Group.findOne({_id: groupId});
            if (!group) res.status(400).send({ message: `Group: ${groupId} is not found!` });
    
            // send the latest chat in this response
            const isLoggedUserMemberOfGroup = group.members.find(i => i.member._id.equals(req.user._id) && i.role === 'admin');
            if (!isLoggedUserMemberOfGroup)  return res.status(500).send({ message: 'Oops! User does not have privilege to update the group' });
    
            group.name = req.body.name;
            group.save();
            
            res.send(group);
        }
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// delete group by id
router.delete('/:groupId', verifyToken, async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // check if group exist
        let group = await Group.findOne({_id: groupId});
        if (!group) res.status(400).send({ message: `Group: ${groupId} is not found!` });

        // check whether the LoggedIn User Member of Group
        const isLoggedUserMemberOfGroup = group.members.find(i => i.member._id.equals(req.user._id) && i.role === 'admin');
        if (!isLoggedUserMemberOfGroup)  return res.status(500).send({ message: 'Oops! User does not have privilege to delete the group' });
        
        await group.remove();
        
        res.send({ message: `The group bearing id: ${groupId}  has been successfully deleted` });
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
    }
});

// join to a group, applicable only for logged in user
router.post('/:groupId/join', verifyToken, async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // check if group exist
        let group = await Group.findOne({_id: groupId});
        if (!group) res.status(400).send({ message: `Group: ${groupId} is not found!` });

        // check user membership in group
        const isLoggedUserMemberOfGroup = group.members.find(i => i.member.equals(req.user._id));
        if (isLoggedUserMemberOfGroup) return res.status(500).send({ message: 'Oops! User is already a member of the group' });

        group.members.push({ member: req.user._id, role: 'member' })
        await group.save();

        // link group to user info 
        const isGroupExistInLoggedInUserGroups = req.user.groups.find(i => i.group.equals(group._id));
        if(isGroupExistInLoggedInUserGroups) return res.status(500).send({ message: 'Oops! User is already a member of the group' });

        req.user.groups.push({group: group._id, role: 'member'});
        await req.user.save();
        
        res.send(group.populate('members.member', 'name email avatar'));
    } catch (error) {
        res.status(500).send({ message: 'Oops! Could not process the Request', error });
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