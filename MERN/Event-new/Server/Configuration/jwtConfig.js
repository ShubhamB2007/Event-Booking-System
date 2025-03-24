const crypto = require('node:crypto')

const secretKey = crypto.randomBytes(32).toString('hex')
console.log("Secret Key", secretKey)

module.exports = {secretKey:secretKey}  