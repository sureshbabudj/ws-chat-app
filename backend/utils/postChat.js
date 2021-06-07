const {Chat} = require('../model/Chat');
const {User} = require('../model/User');
const Group = require('../model/Group'); 
 
 async function postChat(req) {
    await Chat.validate(req.body);
    const payload = {
        "message": req.body.message,
        "author": req.user._id
    };
    if (req.body.recipient) {
        const recipient = await User.findOne({_id: req.body.recipient});
        if (!recipient) return res.status(400).send({ message: `The Recipient bearing id ${req.body.recipient} is not found` });
        payload.recipient = recipient._id;
    } else if (req.body.group) {
        const group = await Group.findOne({_id: req.body.group});
        if (!group) return res.status(400).send({ message: `The Group bearing id ${req.body.group} is not found` });

        const isLoggedUserMemberofGroup = req.user.groups.find(i => i.group.equals(group._id));
        if (!isLoggedUserMemberofGroup) return res.status(400).send({ message: `The author is not a member of the Group bearing id ${req.body.group}` });
        payload.group = group._id;
    } else {
        return res.status(400).send({ message: `Either Recipient id or Group id should be present and valid` });
    }
    const chat = new Chat(payload);
    await chat.save();
    return chat;
}

module.exports.postChat = postChat;

