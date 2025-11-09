// Global function that will help use handle promise rejections, this article talks about it http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
const pe = require('parse-error'); // Parses error so you can read error message and handle them accordingly.

/**
 * Method which is designed to handle promises in a way that allows for simpler and cleaner error handling.
 * @returns This method always returns an array, where the first element is either null (indicating no error) or
 * the error itself, and the second element is the resolved value of the promise.
 */
const to = function (promise) {
  return promise
    .then(data => {
      return [null, data];
    }).catch(err =>
      [pe(err)]
    );
}
/**
 * Metod which is designed to throw an error with a specified error message and optionally
 * log that message to the console if the log parameter is true.
 * @param {string} err_message To define the error message.
 * @param {boolean} log To define the log.
 */
const TE = function (err_message, log) { // TE stands for Throw Error
  if (log === true) {
    console.error(err_message);
  }
  throw new Error(err_message);
}
/**
 * Method which is used to return an error response to the client side.
 * @param {*} req To define the HTTPS request.
 * @param {*} res To define the HTTPS response.
 * @param {object} err To define the error object.
 * @param {number} code To define the status code.
 * @returns Return the error response.
 */
const ReE = async function (req, res, data, code) {
  const response = {
    success: false,
    data: data.data ? data.data : null,
    error: {
      code: data.error && data.error.code ? data.error.code : 'NO ERROR CODE',
      message: data.message ? data.message : data.error.message ? data.error.message : null
    }
  };
  return res.json(response);
}
/**
 * Method which is used to return a successful response to the client side.
 * @param {*} res To define the HTTPS response.
 * @param {*} data To define the data for sending to the client.
 * @param {number} code To define the status code.
 * @returns Return the success response.
 */
const ReS = function (res, data, code) {
  const response = {
    success: true,
    data: data.data ? data.data : null,
    message: data.message ? data.message : null
  };
  if (typeof code !== 'undefined') res.statusCode = code;
  return res.json(response);
};

// This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});
module.exports = { to, TE, ReE, ReS };
