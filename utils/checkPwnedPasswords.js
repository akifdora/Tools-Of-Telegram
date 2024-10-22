const axios = require('axios');
const sha1 = require('sha1');

function checkPwnedPasswords(password) {
    const hash = sha1(password).toUpperCase();
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    return axios.get(`https://api.pwnedpasswords.com/range/${prefix}`).then(response => {
        const lines = response.data.split('\n');
        for (let line of lines) {
            const [hashSuffix, count] = line.split(':');
            if (hashSuffix === suffix) {
                return parseInt(count);
            }
        }
        return 0;
    }).catch(() => {
        return 0;
    });
}

module.exports = { checkPwnedPasswords };
