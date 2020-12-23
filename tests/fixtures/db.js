const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Task = require('../../src/models/Task');
const User = require('../../src/models/User');

const userOneID = new mongoose.Types.ObjectId();
const userTwoID = new mongoose.Types.ObjectId();
const taskOneID = new mongoose.Types.ObjectId();
const taskTwoID = new mongoose.Types.ObjectId();
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

const userTwo = {
    _id: userTwoID,
    name: 'Chloe Espinazo',
    password: 'test1234',
    email: 'hellome@gmail.com',
    age: 21,
    tokens: [
        {
            token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECERET_KEY, {
                expiresIn: process.env.JWT_EXPRIES_IN,
            }),
        },
    ],
};

const taskOne = {
    _id: taskOneID,
    owner: userOneID,
    completed: true,
    description: 'Clean up your shoes',
};

const taskTwo = {
    _id: taskTwoID,
    owner: userTwoID,
    description: 'Complete Your Lazypass project',
};

const populateDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    const userO = await User.findById(userOneID).select('+admin');
    userO.admin = true;
    await userO.save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
};

module.exports = { taskTwoID, taskOneID, userOneID, userOne, populateDatabase };
