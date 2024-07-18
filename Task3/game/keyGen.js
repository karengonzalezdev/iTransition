const crypto = require('crypto');

class KeyGen {
    static genKey() {
        return crypto.randomBytes(32).toString('hex');
    }
}

module.exports = KeyGen;