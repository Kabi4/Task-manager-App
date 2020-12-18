const mongoose = require('mongoose');
const express = require('express');

const User = require('./models/User');
const Task = require('./models/Task');

const app = express();

const PORT = process.env.PORT || 3000;
const ConnectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

app.use(express.json());

app.post('/api/v1/user', (req, res) => {
    const contents = req.body;
    const newUser = new User(contents);
    newUser
        .save()
        .then(() => {
            console.log('New User Created', newUser);
            res.send(newUser);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });
});

app.post('/api/v1/task', (req, res) => {
    const contents = req.body;
    const newTask = new Task(contents);
    newTask
        .save()
        .then(() => {
            console.log('New User Created', newTask);
            res.send(newTask);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });
});

mongoose.connect(
    ConnectionURL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
    },
    (error, client) => {
        if (error) {
            return console.log('Database Connection Failed');
        }
        console.log('Database Conection Successful!');
    }
);

app.listen(PORT, () => {
    console.log(`Server up and running on PORT ${PORT}`);
});
