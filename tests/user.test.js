const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const userOneID = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneID,
    name: 'Kriti Kuttiya',
    password: 'test1234',
    email: 'kritikutti@gmail.com',
    age: 21,
    tokens: [
        {
            token: jwt.sign({ _id: userOneID }, process.env.JWT_SECERET_KEY, {
                expiresIn: process.env.JWT_EXPRIES_IN,
            }),
        },
    ],
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
    await request(app)
        .post('/api/v1/user/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);
});

test('Should Not Login Existing User', async () => {
    await request(app)
        .post('/api/v1/user/login')
        .send({
            email: `{$eq: '' }`,
            password: userOne.password,
        })
        .expect(400);
});

test('Should get profile of authenticate user!', async () => {
    await request(app)
        .get('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});
