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
            res.send(newUser);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

app.post('/api/v1/task', (req, res) => {
    const contents = req.body;
    const newTask = new Task(contents);
    newTask
        .save()
        .then(() => {
            res.send(newTask);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

app.get('/api/v1/user', (req, res) => {
    User.find()
        .then((users) => {
            res.send(users);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

app.get('/api/v1/task', (req, res) => {
    Task.find()
        .then((tasks) => {
            res.send(tasks);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

app.get('/api/v1/user/:id', (req, res) => {
    const _id = req.params.id;
    User.findById(_id)
        .then((user) => {
            if (!user) {
                return res.status(404).send();
            }
            res.send(user);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

app.get('/api/v1/task/:id', (req, res) => {
    const _id = req.params.id;
    Task.findById(_id)
        .then((task) => {
            if (!task) {
                return res.status(404).send();
            }
            res.send(task);
        })
        .catch((err) => {
            res.status(500).send(err);
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
