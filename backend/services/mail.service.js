const nodemailer = require('nodemailer');
const { TE } = require('../responseHandler');
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth : {
        user : CONFIG.email_user,
        pass : CONFIG.email_pass
    }
});

const sendMailer = (email, subject, template) => {
    const mailOptions = {
        from : CONFIG.email_user,
        to : email,
        subject : subject,
        html : template
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) TE(err);
    })
}
module.exports.sendMailer = sendMailer;