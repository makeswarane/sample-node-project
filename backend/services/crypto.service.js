const cryptoJS = require('crypto-js');
const encrypt = async (plainText) => {
    const cryptedText = cryptoJS.AES.encrypt(plainText.toString(), CONFIG.secretKey).toString();
    return cryptedText;
};
module.exports.encrypt = encrypt;
const decrypt = (cryptedText) => {
    const Bytes = cryptoJS.AES.decrypt(cryptedText.toString(), CONFIG.secretKey);
    const plainText = Bytes.toString(cryptoJS.enc.Utf8);
    return plainText;
}
module.exports.decrypt = decrypt;
