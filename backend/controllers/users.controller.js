const fs = require('fs');
const path = require('path');
const Users = require('../models').users;
const { to, ReE, ReS } = require('../responseHandler');
const mailService = require('../services/mail.service');
const iterateService = require('../services/mailIterate.service');
const { ERROR, SUCCESS } = require('../constants/messages');
const signUp = async (req, res) => {
    let err, exist, user;
    const body = req.body;
    [err , exist] = await to(Users.findOne({ where : { email : body.email }}));
    if(err) return ReE(req, res, err, 422);
    if(exist) return ReE(req, res, { message : ERROR.USER_EXIST }, 409);
    [err, user] = await to(Users.create({
        name : body.name,
        email : body.email,
        password : body.password,
        phoneNumber : body.phoneNumber,
    }));
    if(err) return ReE(req, res, err, 422);
    const deleteFields = ["address", "forgetpassAt", "password", "forgetPass", "createdAt"];
    deleteFields.forEach((values) => {
        delete user.dataValues[values];
    });
    return ReS(res, { data : user, message : SUCCESS.USER_CREATED}, 201);
}; 
module.exports.signUp = signUp;
const signIn = async(req, res) => {
    let err, user;
    const body = req.body;
    [err, user] = await to(Users.findOne({ where : { email : body.email }}));
    if(err) return ReE(req, res, err, 422);
    if(!user) return ReE(req, res , { message : ERROR.NO_USER_EXIST}, 404);
    [err, cpass] = await to(user.comparePassword(body.password));
    if(err) return ReE(req, res, err, 422);
    if(!cpass) return ReE(req, res, { message : ERROR.INAVLID_PASSWORD}, 422);
    [err, token] = await to(user.getToken(user));
    if(err) return ReE(req, res, err, 422);
    return ReS(res, {data : token, message : SUCCESS.LOGEDIN}, 200);
}
module.exports.signIn = signIn;
const forgetPassword = async (req, res) => {
    let err, user, updatef;
    const body = req.body.email;
    [err, user] = await to(Users.findOne({ where : { email : body}}));
    if(err) return ReE(req, res, err, 422);
    if(!user) return ReE(req, res , { message : ERROR.NO_USER_EXIST}, 404);
    const otp = Math.floor(1000 + Math.random() * 9000);
    const forgetPassAt = new Date(Date.now() + 10 * 60 * 1000);
    [err, updatef] = await to(Users.update({ forgetPass : otp, forgetpassAt : forgetPassAt }, { where : { email : body}}));
    if(err) return ReE(req, res, err, 422);
    const templatePath = path.join(__dirname, "../public/template/otpMail.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    const obj = {
        username : user.dataValues.name,
        otp : otp
    };
    const iterate = iterateService.iterate(obj, htmlTemplate);
    const subject = "Forget Password Povomah - Reg";
    mailService.sendMailer(body, subject, iterate);
    return ReS(res, { message : SUCCESS.MAILED}, 200);
}
module.exports.forgetPassword = forgetPassword;
const verifyOtp = async(req, res) => {
    let err, user;
    const body = req.body;
    [err, user] = await to(Users.findOne({ where : { email : body.email }}));
    if(err) return ReE(req, res, err, 422);
    if(!user) return ReE(req, res , { message : ERROR.NO_USER_EXIST}, 404);
    const currentTime = new Date();
    if(currentTime>user.forgetPassAt) return ReE(req, res, { message : ERROR.OTP_EXPIRES}, 403);
    if(body.otp != user.forgetPass) return ReE(req, res, { message : ERROR.INAVLID_OTP}, 403);
    [err, up] = await to(Users.update({ forgetPass : null, forgetpassAt : null}, { where : { email : user.email}}));
    if(err) return ReE(req ,res, err, 422);
    return ReS(res, { message : SUCCESS.OTP_VERIFIED}, 200);
}
module.exports.verifyOtp = verifyOtp;
const updatePassword = async(req, res) => {
    let err, user, cpass, up;
    const body = req.body;
    [err, user] = await to(Users.findOne({ where : { email : body.email }}));
    if(err) return ReE(req, res, err, 422);
    if(!user) return ReE(req, res , { message : ERROR.NO_USER_EXIST}, 404);
    [err, cpass] = await to(user.forgetComparePassword(body.password));
    if(err) return ReE(req, res, err, 422);
    [err, up] = await to(Users.update({ password : body.password }, { where : { email : user.email }, individualHooks : true}));
    if(err) return ReE(req, res, err, 422);
    return ReS(res, { message : SUCCESS.PASSWORD_UPDATED}, 201);
}
module.exports.updatePassword = updatePassword;