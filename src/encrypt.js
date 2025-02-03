import CryptoJS  from 'crypto-js'

const secretKey = 'abcde';
export  const authName = 'Prad@2025'

 // Function to encrypt a value
 export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  };
