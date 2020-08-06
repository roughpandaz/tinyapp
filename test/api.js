const request = require('supertest');
const assert = require('chai').assert;
const app = require('../express_server');

describe('User Endpost', () => {

  let user = {
    email: "a@b.com",
    password: '123',
  };
  
  it('should create the user and be taken to redirect', async() => {
    const res = await request(app)
      .post('/api/user/register')
      .set('Accept', 'application/json')
      .send(user);

    assert.equal(res.statusCode, 302);
  });

  it('should create the user and be taken to redirect', async() => {
    const res = await request(app)
      .post('/api/user/register')
      .send(user);

    assert.equal(res.statusCode, 409);
  });

  it('should create the user and be taken to redirect', async() => {
    const res = await request(app)
      .post('/api/user/register')
      .send({email: "", password: ""});

    assert.equal(res.statusCode, 500);
  });
});