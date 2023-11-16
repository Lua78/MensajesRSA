const crypto = require('crypto');
const bcrypt = require('bcrypt');

const algorithm = 'aes-256-ctr';
const IV_LENGTH = 16;
const skey = "askadq-fgwfjwnhef";

function GetBytesKey(key) {
    const key_base_64 = crypto.createHash('sha256').update(String(key)).digest('base64');
    return Buffer.from(key_base_64, 'base64');
}

function AesEncryptPass(pass) {
    return new Promise((resolve, reject) => {
        try {
            const iv = crypto.randomBytes(IV_LENGTH);
            let keyB = GetBytesKey(skey);
            let cipher = crypto.createCipheriv(algorithm, Buffer.from(keyB), iv);
            let encrypted = cipher.update(pass);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            resolve(iv.toString('hex') + ':' + encrypted.toString('hex'));
        } catch (error) {
            reject(error);
        }
    });
}
function EncriptarMensaje(mensaje, publicKeyPEM) {
    return new Promise((resolve, reject) => {
      try {
        const publicKey = crypto.createPublicKey({
          key: publicKeyPEM,
          format: 'pem',
        });
        const mensajeCifrado = crypto.publicEncrypt(publicKey,Buffer.from(mensaje, 'utf-8'));
  
        resolve(mensajeCifrado.toString('base64'));
      } catch (error) {
        reject(error);
      }
    });
}
  
function DesEncriptarMensaje(mensaje, privateKeyPEM) {
    return new Promise((resolve, reject) => {
        try {
            const privateKey = crypto.createPrivateKey({
                key: privateKeyPEM,
                format: 'pem',
            });
            const encryptedBuffer = Buffer.from(mensaje, 'base64');
            const mensajeDesCifrado = crypto.privateDecrypt(privateKey, encryptedBuffer);

            resolve(mensajeDesCifrado.toString());
        } catch (error) {
            reject(error);
        }
    });
}


function AesDecryptPass(pass) {
    return new Promise((resolve, reject) => {
        try {
            let keyB = GetBytesKey(skey);
            let textParts = pass.split(':');
            let iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedPass = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv(algorithm, Buffer.from(keyB), iv);
            let decrypted = decipher.update(encryptedPass);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            resolve(decrypted.toString());
        } catch (error) {
            reject(error);
        }
    });
}


function GenerarClaves() {
    return new Promise((resolve, reject) => {
        const keySize = 2048;
        crypto.generateKeyPair('rsa', {
            modulusLength: keySize,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        }, async (err, publicKey, privateKey) => {
            if (err) {
                console.error('Error generando el par de claves:', err);
                reject(err);
                return;
            }
            try {
                const iv = crypto.randomBytes(IV_LENGTH);
                const encryptedPrivateKey = await AesEncryptPass(privateKey);
                resolve({ publicKey, encryptedPrivateKey });
            } catch (error) {
                reject(error);
            }
        });
    });
}
async function hashContraseña(contrasena) {
    const saltos = 10;
    const contrasenaHash = await bcrypt.hash(contrasena, saltos);
    return contrasenaHash;
}


async function compararContrasena(inputContrasena, contrasenaHash) {
    const match = await bcrypt.compare(inputContrasena, contrasenaHash);
    return match;
}
module.exports = {hashContraseña,compararContrasena,GenerarClaves,GetBytesKey, EncriptarMensaje,DesEncriptarMensaje,AesEncryptPass,AesDecryptPass};
