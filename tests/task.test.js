const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');
const {
    userOne,
    taskTwoID,
    populateDatabase,
    taskOneID,
} = require('./fixtures/db');

beforeAll(populateDatabase);

test('Should Create a task completed false', async () => {
    const response = await request(app)
        .post('/api/v1/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Learn Node JS',
        })
        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should Create a task with completed true', async () => {
    const response = await request(app)
        .post('/api/v1/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Learn React JS',
            completed: true,
        })
        .expect(201);
    const task = await Task.findById(response.body._id);

    expect(task).not.toBeNull();
    expect(task.completed).toEqual(true);
    task.completed = false;
    await task.save();
});

test('Should get all task of user one', async () => {
    const response = await request(app)
        .get('/api/v1/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    expect(response.body.count).toBe(3);
});

test('Should get incomplete task of user one', async () => {
    const response = await request(app)
        .get('/api/v1/task?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    expect(response.body.count).toBe(2);
});

test('Should get completed task of user one', async () => {
    const response = await request(app)
        .get('/api/v1/task?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    expect(response.body.count).toBe(1);
});

test('Should not change the status of Tasktwo to false', async () => {
    const res = await request(app)
        .patch(`/api/v1/task/${taskTwoID}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true,
        })
        .expect(404);
});

test('Should change the status of taskOne to false', async () => {
    const res = await request(app)
        .patch(`/api/v1/task/${taskOneID}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: false,
        })
        .expect(200);
    expect(res.body.completed).toEqual(false);
});

test('Userone Should unable to delete task of usertwo', async () => {
    await request(app)
        .delete(`/api/v1/task/${taskTwoID}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404);
});

test('Userone Should able to delete his task', async () => {
    await request(app)
        .delete(`/api/v1/task/${taskOneID}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(204);
});
