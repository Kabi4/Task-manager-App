const request = require('supertest');
const axios = require('axios');
const app = require('../src/app');
const User = require('../src/models/User');

beforeEach((done) => {
    User.deleteMany().then(() => {
        done();
    });
});

test('SignUp new user', async () => {
    await request(app)
        .post('/api/v1/user/signup')
        .send({
            name: 'Kushagra Singh',
            password: 'test1234',
            email: 'hykukku@gmail.com',
            age: 21,
        })
        .expect(201);
});
