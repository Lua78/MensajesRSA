const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const IV_LENGTH = 16;
const skey = "askadq-fgwfjwnhef";

function GetBytesKey(key) {
    const key_base_64 = crypto.createHash('sha256').update(String(key)).digest('base64');
    return Buffer.from(key_base_64, 'base64');
}

function AesEncrypt(text, key, iv) {
    return new Promise((resolve, reject) => {
        try {
            let keyB = GetBytesKey(key);
            let cipher = crypto.createCipheriv(algorithm, Buffer.from(keyB), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            resolve(iv.toString('hex') + ':' + encrypted.toString('hex'));
        } catch (error) {
            reject(error);
        }
    });
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

function EncriptarMensaje(mensaje,publicKeyPEM){
    return new Promise((resolve, reject) => {
        try {
            const publicKey = crypto.createPublicKey({
                key: publicKeyPEM,
                format: 'pem',
            });
            const mensajeCifrado = crypto.publicEncrypt(
                {
                  key: publicKey,
                  padding: crypto.constants.RSA_PKCS1_PADDING, // Uso del relleno PKCS#1
                },
                Buffer.from(mensaje, 'utf-8')
            );
            resolve(mensajeCifrado)
        } catch (error) {
            reject(error);
        }
    });
}

function DesEncriptarMensaje(mensaje,privateKeyPEM){
    return new Promise((resolve, reject) => {
        try {
            const privateKey = crypto.createPrivateKey({
                key: privateKeyPEM,
                format: 'pem',
            });
            const mensajeDesCifrado = crypto.privateDecrypt(
                {
                  key: privateKey,
                  padding: crypto.constants.RSA_PKCS1_PADDING, // Uso del relleno PKCS#1
                },
                mensajeDesCifrado
            );
            resolve(mensajeDesCifrado.toString())
        } catch (error) {
            reject(error);
        }
    });
}

function AesDecrypt(text, key) {
    return new Promise((resolve, reject) => {
        try {
            let keyB = GetBytesKey(key);
            let textParts = text.split(':');
            let iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv(algorithm, Buffer.from(keyB), iv);
            let decrypted = decipher.update(encryptedText);
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
                const encryptedPrivateKey = await AesEncrypt(privateKey, skey, iv);
                resolve({ publicKey, encryptedPrivateKey });
            } catch (error) {
                reject(error);
            }
        });
    });
}

module.exports = {GenerarClaves,AesEncrypt,AesDecrypt,GetBytesKey, EncriptarMensaje,DesEncriptarMensaje,AesEncryptPass};
