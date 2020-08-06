/**
 * See if users exists
 * @param {Object} users object of all users
 * @param {String} email user's email
 * @returns {Boolean} true if user is found
 */
const findUser = function(users, email) {
  for (const key in users) {
    if (Object.prototype.hasOwnProperty.call(users, key)) {
      if (users[key].email === email) {
        return key;
      }
    }
  }
  return false;
};

module.exports = {findUser};