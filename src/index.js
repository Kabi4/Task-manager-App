const mongoose = require('mongoose');
const express = require('express');

const User = require('./models/User');
const Task = require('./models/Task');

const app = express();

const PORT = process.env.PORT || 3000;
const ConnectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

app.use(express.json());

app.post('/api/v1/user', async (req, res) => {
    // const contents = req.body;
    // const newUser = new User(contents);
    // newUser
    //     .save()
    //     .then(() => {
    //         res.send(newUser);
    //     })
    //     .catch((err) => {
    //         res.status(400).send(err);
    //     });
    try {
        const contents = req.body;
        const newUser = await new User(contents).save();
        res.send(newUser);
    } catch (eerror) {
        res.status(400).send(error);
    }
});

app.post('/api/v1/task', async (req, res) => {
    // const contents = req.body;
    // const newTask = new Task(contents);
    // newTask
    //     .save()
    //     .then(() => {
    //         res.send(newTask);
    //     })
    //     .catch((err) => {
    //         res.status(400).send(err);
    //     });
    try {
        const contents = req.body;
        const newTask = await new Task(contents).save();
        res.send(newTask);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/api/v1/user', async (req, res) => {
    // User.find()
    //     .then((users) => {
    //         res.send(users);
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     });
    try {
        const users = await User.find();
        res.send({
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/v1/task', async (req, res) => {
    // Task.find()
    //     .then((tasks) => {
    //         res.send(tasks);
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     });
    try {
        const tasks = await Task.find();
        res.send({
            count: tasks.length,
            tasks,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/v1/user/:id', async (req, res) => {
    const _id = req.params.id;
    // User.findById(_id)
    //     .then((user) => {
    //         if (!user) {
    //             return res.status(404).send();
    //         }
    //         res.send(user);
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     });
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/v1/task/:id', async (req, res) => {
    const _id = req.params.id;
    // Task.findById(_id)
    //     .then((task) => {
    //         if (!task) {
    //             return res.status(404).send();
    //         }
    //         res.send(task);
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     });
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.patch('/api/v1/user/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) {
        return res
            .status(400)
            .send('A Sensitive information or invalid information sent!');
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).send('User not found!');
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.patch('/api/v1/task/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) {
        return res.status(400).send('A invalid information Received!');
    }
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        if (!task) {
            return res.status(404).send('task not found!');
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

mongoose.connect(
    ConnectionURL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
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
