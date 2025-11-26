const joi = require('joi');
const { ReE } = require('../responseHandler');
module.exports.signUpValidator = (req, res, next) => {
    const signUpSchema = joi.object({
        name : joi.string().min(3).max(20).required(),
        email : joi.string().email().required(),
        password : joi.string().min(6).required(),
        confirmPassword : joi.string().valid(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
        phoneNumber : joi.string().pattern(/^\d{10}$/).required().messages({ 'string.pattern.base': 'Phone number must be 10 digits' })
    });
    const { error } = signUpSchema.validate(req.body, { stripUnknown : true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message });
    next();
};
module.exports.signInValidator = (req, res, next) => {
    const signInSchema = joi.object({
        email : joi.string().email().required(),
        password : joi.string().min(6).required(),
    });
    const { error } = signInSchema.validate(req.body, { stripUnknown : true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message });
    next();
};
module.exports.forgetPassValidator = (req, res, next) => {
    const forgetPassSchema = joi.object({
        email : joi.string().email().required(),
    });
    const { error } = forgetPassSchema.validate(req.body, { stripUnknown : true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message });
    next();
};
module.exports.verifyOtpValidator = (req, res, next) => {
    const verifyOtpSchema = joi.object({
        email : joi.string().email().required(),
        otp : joi.number().integer().required()
    });
    const { error } = verifyOtpSchema.validate(req.body, { stripUnknown : true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message });
    next();
};
module.exports.updatePasswordValidator = (req, res, next) => {
    const updatePasswordSchema = joi.object({
        email : joi.string().email().required(),
        password : joi.string().min(6).required(),
        confirmPassword : joi.string().valid(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
    });
    const { error } = updatePasswordSchema.validate(req.body, { stripUnknown : true });
    if (error) return res.status(422).json({ success: false, message: error.details[0].message });
    next();
};