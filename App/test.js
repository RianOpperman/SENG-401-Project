const crypto = require('crypto');

let sha = crypto.createHash('sha512');

sha.update('bob');

console.log(sha.digest('hex'));