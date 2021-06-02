const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

const userValidations = {
    name: Joi.string().min(3).max(255).trim().required(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(1024).trim().required(),
    createdAt: Joi.date().default(Date.now)
};

const loginJoiSchema = Joi.object({
    email: userValidations.email,
    password: userValidations.password
});

const userJoiSchema = Joi.object(userValidations);

const userSchema = new mongoose.Schema(Joigoose.convert(userJoiSchema));
module.exports = {
    User: mongoose.model('User', userSchema),
    loginValidation: loginJoiSchema
};