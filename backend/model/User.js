const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

const userValidations = {
    name: Joi.string().min(3).max(255).trim().required(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(1024).trim().required().strip(),
    createdAt: Joi.date().default(Date.now),
    groups:  Joi.array().items(
        Joi.object(
            {
                group: Joi.string().meta({
                    _mongoose: {type: "ObjectId", ref: "Group"},
                }),
                role: Joi.string().valid('admin', 'member')
            }
      ).default({})),
    avatar: Joi.string()
};

const loginJoiSchema = Joi.object({
    email: userValidations.email,
    password: userValidations.password
});

const userJoiSchema = Joi.object(userValidations);

const userSchema = new mongoose.Schema(Joigoose.convert(userJoiSchema));

// remove all ref in users when group removed
userSchema.pre('remove', async function() {
    // Remove all the docs that refers
    try {
        const groups = await this.model('Group').find({'members.member': this._id});
        for (const group of groups) {
            const groupIndex = group.members.findIndex(j => j.member.equals(this._id));
            group.members.splice(groupIndex, 1);
            await group.save();
        }
    } catch (error) {
        throw new Error(error);
    }
    
});

userSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        var retJson = {
            _id: ret._id,
            name: ret.name,
            email: ret.email,
            createdAt: ret.createdAt,
            groups: ret.groups,
            avatar: ret.avatar
        };
        return retJson;
    }
});

module.exports = {
    User: mongoose.model('User', userSchema),
    loginValidation: loginJoiSchema,
    userValidations: userValidations
};