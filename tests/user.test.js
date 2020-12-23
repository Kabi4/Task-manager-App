const request = require('supertest');
const { userOne, userOneID, populateDatabase } = require('./fixtures/db');
const app = require('../src/app');
const User = require('../src/models/User');

beforeEach(populateDatabase);

test('SignUp new user', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send({
            name: 'Kushagra Singh',
            password: 'test1234',
            email: 'hykush@gmail.com',
            age: 21,
        })
        .expect(201);
    const user = await User.findById(response.body.newUser._id);
    expect(user).not.toBeNull();
    expect(response.body.newUser.name).toBe('Kushagra Singh');
    expect(response.body.newUser.password).not.toBe('test1234');
});

test('Should Login Existing user', async () => {
    const response = await request(app)
        .post('/api/v1/user/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);
    expect(response.body.user.tokens.length).toBe(2);
    expect(response.body.token).toBe(response.body.user.tokens[1].token);
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
    const res = await request(app)
        .get('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    expect(res.body.user.admin).toEqual(true);
});

test('Should not get profile of unauthenticate user!', async () => {
    await request(app)
        .get('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}asdasa`)
        .send()
        .expect(401);
});

test('Should not Delete profile of unauthenticate user!', async () => {
    await request(app)
        .delete('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}asdasa`)
        .send()
        .expect(401);
});

test('Should Delete profile of authenticate user!', async () => {
    await request(app)
        .delete('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(204);
    expect(await User.findById(userOneID)).toBeNull();
});

test('Should Upload User Avatar', async () => {
    await request(app)
        .post('/api/v1/user/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('upload', 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    const user = await User.findById(userOneID).select('+avatar');
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should remove user avatar', async () => {
    await request(app)
        .delete('/api/v1/user/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(204);
    const user = await User.findById(userOneID).select('+avatar');
    expect(user.avatar).not.toEqual(expect.any(Buffer));
});

test('Should update valid fields in user', async () => {
    const user = await request(app)
        .patch('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Cutie Kriti',
        })
        .expect(200);
    expect(user.body.name).toBe('Cutie Kriti');
});

test('Should not update sensitive fields here', async () => {
    await request(app)
        .patch('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: 'test12345',
        })
        .expect(400);
});

test('Should not update not mentioned fields here', async () => {
    await request(app)
        .patch('/api/v1/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            category: 'gernal',
        })
        .expect(400);
});

test('Should Update password.', async () => {
    const res = await request(app)
        .patch('/api/v1/user/me/updatepassword')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            newPassword: 'test12345',
        })
        .expect(200);
    expect(res.body.user.tokens.length).toBe(1);
});
