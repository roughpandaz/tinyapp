const assert = require('chai').assert;
const {findUser} = require('../utils/find-user');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


describe('Find users', () => {
  it('should return a user with valid email', function() {
    const user = findUser(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user,expectedOutput);
  });
});