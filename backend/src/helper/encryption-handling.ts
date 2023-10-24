const CryptoJS = require("crypto-js");
const secretKey = process.env['SECRET_HASH_KEY']


export const encrypt =  (text: string): string => {
    let encryptedText: string =   CryptoJS.AES.encrypt(text, secretKey).toString();
    return encryptedText;
}

export const decrypt =  (encyptedText: string): string => {
    let bytes =  CryptoJS.AES.decrypt(encyptedText, secretKey);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;

}

module.exports = {
    encrypt,
    decrypt,
};