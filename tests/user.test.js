const request = require('supertest');
const axios = require('axios');
const app = require('../src/app');
const User = require('../src/models/User');

const userOne = {
    name: 'Kriti Kuttiya',
    password: 'test1234',
    email: 'kritikutti@gmail.com',
    age: 21,
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('SignUp new user', async () => {
    await request(app)
        .post('/api/v1/user/signup')
        .send({
            name: 'Kushagra Singh',
            password: 'test1234',
            email: 'hykushag@gmail.com',
            age: 21,
        })
        .expect(201);
});

test('Should Login Existing user', async () => {
    const login = await request(app)
        .post('/api/v1/user/login')
        .send({
            email: 'kritikutti@gmail.com',
            password: 'test1234',
        })
        .expect(200);
    console.log(login);
});
