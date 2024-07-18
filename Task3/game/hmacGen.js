const crypto = require('crypto');

class HmacGen {
    static calculateHmac(key, message) {
        return crypto.createHmac('sha256', key).update(message).digest('hex');
    }
}

module.exports = HmacGen;