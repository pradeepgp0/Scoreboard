import CryptoJS  from 'crypto-js'

const secretKey = 'abcde';

 // Function to encrypt a value
 export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  };
