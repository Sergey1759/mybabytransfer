const jsonWebToken = require('jsonwebtoken');
const config = require('config');

function getToken(id) {
    const token = jsonWebToken.sign({
            userId: id
        },
        config.get('secret_jwt'), {
            expiresIn: '3h'
        }
    );
    return token;
}

module.exports = {
    getToken
}