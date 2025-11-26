const rateLimiter = require('express-rate-limit');
const { ERROR } = require('../constants/messages');
module.exports.limiter = rateLimiter({
    windowMs : 1 * 60 * 1000,
    max : 5,
    message : ERROR.TOO_MANY_REQUEST
});