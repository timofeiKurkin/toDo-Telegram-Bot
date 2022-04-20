const crypto = require('crypto');
const fs = require('fs');
const util = require('util')

const cipherData = fs.readFileSync(`${__dirname}/key.json`)
const { key, algorithm } = JSON.parse(cipherData)

function encrypt(string) {
    const iv = crypto.randomBytes(8).toString('hex')
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex')
    return `${encrypted}:${iv}`
}

function decrypt(string) {
    const arrStr = string.split(':')
    const decipher = crypto.createDecipheriv(algorithm, key, arrStr[1])
    let decrypted = decipher.update(arrStr[0], 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}

module.exports = {encrypt, decrypt}