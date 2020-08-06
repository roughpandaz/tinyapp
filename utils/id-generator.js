const crypto = require('crypto');

const generateRandomString = function(input) {
  const secret = 'abcdefg';
  const hash = crypto.createHmac('sha256', secret)
    .update(input)
    .digest('hex');
  // return only first 6 charactors of the hash
  return hash.split("").splice(0,6).join("");
};

const generateRandomID = function(size) {
  size = size ? size : 6;
  return crypto.randomBytes(size).toString('hex');
};

module.exports = {generateRandomString, generateRandomID};