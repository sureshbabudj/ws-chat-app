const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

const groupJoiSchema = Joi.object({
    name: Joi.string().min(3).max(255).trim().required(),
    createdAt: Joi.date().default(Date.now),
    members: Joi.array().items(
        Joi.object(
            {
                member: Joi.string().meta({
                    _mongoose: {type: "ObjectId", ref: "User"},
                }),
                role: Joi.string().valid('admin', 'member')
            }
      ).default({})),
    avatar: Joi.string()
});

const groupSchema = new mongoose.Schema(Joigoose.convert(groupJoiSchema));

// remove all ref in users when group removed
groupSchema.pre('remove', async function() {
    // Remove all the docs that refers
    try {
        const users = await this.model('User').find({'groups.group': this._id});
        for (const user of users) {
            const userIndex = user.groups.findIndex(j => j.group.equals(this._id));
            user.groups.splice(userIndex, 1);
            await user.save();
        }
    } catch (error) {
        throw new Error(error);
    }
    
});

module.exports = mongoose.model('Group', groupSchema);