const bcrypt = require('bcryptjs');

// Hash token for storage
const hashToken = async (token) => {
  return await bcrypt.hash(token, 10);
};

// Compare token with stored hash
const compareToken = async (token, hashedToken) => {
  return await bcrypt.compare(token, hashedToken);
};

module.exports = { hashToken, compareToken };