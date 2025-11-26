const joi = require('joi');
module.exports.addOwnersValidator = (req, res, next) => {
    const addOwnersSchema = joi.object({
        name : joi.string().min(3).max(20).required(),
        password : joi.string().min(6).required(),
        email : joi.string().email().required(),
        phoneNumber : joi.string().pattern(/^\d{10}$/).required().messages({ 'string.pattern.base': 'Phone number must be 10 digits' }),
        confirmPassword : joi.string().valid(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
    });
    const {error} = addOwnersSchema.validate(req.body, { stripUnknown: true});
    if(error) res.status(422).json({ success : false, message : error.details[0].message});
    next();
};
module.exports.updateTravelsDetailsValidator = (req, res, next) => {
    const updateTravelsDetailsSchema = joi.object({
        ownerID : joi.number().integer().required(),
        travelsName : joi.string().required(),
        CIN : joi.string().length(21).required(),
        GST : joi.string().length(15).required(),
    });
    const {error} = updateTravelsDetailsSchema.validate(req.body, { stripUnknown: true});
    if(error) res.status(422).json({ success : false, message : error.details[0].message});
    next();
};
module.exports.addBusDetailsValidator = (req, res, next) => {
    const addBusDetailsSchema = joi.object({
        travelsID : joi.number().integer().required(),
        numberPlate : joi.string().required(),
        AC : joi.boolean().required(),
        seatCount : joi.number().integer().required(),
        sleeper : joi.boolean().required()
    });
    const {error} = addBusDetailsSchema.validate(req.body, { stripUnknown: true});
    if(error) res.status(422).json({ success : false, message : error.details[0].message});
    next();
};
module.exports.travelsBusesValidator = (req, res, next) => {
    const travelsBusesSchema = joi.object({
        travelsID : joi.number().integer().required()
    });
    const {error} = travelsBusesSchema.validate(req.body, { stripUnknown: true});
    if(error) res.status(422).json({ success : false, message : error.details[0].message});
    next();
};