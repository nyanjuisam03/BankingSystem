const jwt = require('jsonwebtoken');

const JWT_SECRET = 'myVerySecure123!@#$%^&*()_+Key';
const JWT_EXPIRES_IN = '24h';

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN
};