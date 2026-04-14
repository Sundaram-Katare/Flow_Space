const jwt = require('jsonwebtoken');
const env = require('../config/env');

+function generateToken(userId) {
  return jwt.sign(
    { userId },               
    env.jwt.secret,               
    { expiresIn: env.jwt.expiry } 
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}

module.exports = {
  generateToken,
  verifyToken,
};