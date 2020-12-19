const Task = require('../models/Task');

const router = require('express').Router();

router.post('/', async (req, res) => {
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
        res.status(201).send(newTask);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) {
        return res.status(400).send('A invalid information Received!');
    }
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true,
        //     useFindAndModify: false,
        // });
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found!');
        }
        updates.forEach((update) => {
            task[update] = req.body[update];
        });
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found!');
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
