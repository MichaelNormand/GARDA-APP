const crypto = require('crypto')
const algorithm = 'aes-256-cbc'

module.exports = {
    encrypt: (text, secret) => {
        let key = crypto.scryptSync(secret, 'salt', 32)
        let iv = Buffer.alloc(16, '0102030405060708', 'binary')
        let encrypter = crypto.createCipheriv(algorithm, key, iv)
        let encryptedText = encrypter.update(text, 'utf8', 'hex')
        encryptedText += encrypter.final('hex')
        return encryptedText
    },
    decrypt: (encryptedText, secret) => {
        let key = crypto.scryptSync(secret, 'salt', 32)
        let iv = Buffer.alloc(16, '0102030405060708', 'binary')
        let decrypter = crypto.createDecipheriv(algorithm, key, iv)
        let decryptedText = decrypter.update(encryptedText, 'hex', 'utf8')
        decryptedText += decrypter.final('utf8')
        return decryptedText
    }
}
