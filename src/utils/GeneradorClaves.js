const crypto = require('crypto');

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
        }, (err, publicKey, privateKey) => {
            if (err) {
                console.error('Error generando el par de claves:', err);
                reject(err);
                return;
            }
            const encryptionKey = crypto.randomBytes(32); // Clave aleatoria para cifrar
            const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
            const encryptedPrivateKey = Buffer.concat([
            cipher.update(privateKey, 'utf-8'),
            cipher.final(),
            ]);

            console.log('Clave pública:');
            console.log(publicKey);

            console.log('\nClave privada:');
            console.log(privateKey);

            
            console.log('\nClave privada Cifrada:');
            console.log(encryptedPrivateKey);

            // Puedes devolver las claves si es necesario
            resolve({ publicKey, privateKey });
        });
    });
}

module.exports = GenerarClaves;
