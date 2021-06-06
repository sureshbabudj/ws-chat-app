const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);


const chatValidations = {
    sentAt: Joi.date().default(Date.now),
    updatedAt: Joi.date(),
    author: Joi.string().meta({
        _mongoose: {type: "ObjectId", ref: "User"},
    }),
    recipient: Joi.string().meta({
        _mongoose: {type: "ObjectId", ref: "User"},
    }),
    group: Joi.string().meta({
        _mongoose: {type: "ObjectId", ref: "Group"},
    }),
    tag: Joi.string().valid('favorite', 'archive'),
    message: Joi.string().min(1).required(),
    unread: Joi.boolean().default(true)
};

const chatJoiSchema = Joi.object(chatValidations).or('recipient', 'group');

const chatSchema = new mongoose.Schema(Joigoose.convert(chatJoiSchema));

module.exports =  {
    Chat: mongoose.model('Chat', chatSchema), chatValidations
};


