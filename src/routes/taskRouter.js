const Task = require('../models/Task');
const verifyToken = require('../middlewares/Auth');
const router = require('express').Router();
const { ObjectId } = require('mongoose');

router.use(verifyToken);

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
        contents.owner = req.user._id;
        const newTask = await new Task(contents).save();
        res.status(201).send(newTask);
    } catch (error) {
        // console.log(error);
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
        // console.log(
        //     typeof tasks[0].owner.toString() === typeof req.user._id.toString()
        // );
        let completed = undefined;
        let tasks = [];
        if (req.query.sortBy) {
            const sortBy = req.query.sortBy.split(',').join(' ');
            //sort('price ratingAverage')
            tasks = await Task.find().sort(sortBy);
        } else {
            tasks = await Task.find().sort('-createdAt');
        }
        if (req.query.completed) {
            completed =
                req.query.completed.toLowerCase() === 'true' ? true : undefined;
            if (!completed)
                completed =
                    req.query.completed.toLowerCase() === 'false'
                        ? false
                        : undefined;
        }

        if (completed === undefined) {
            tasks = tasks.filter(
                (task) => task.owner._id.toString() === req.user._id.toString()
            );
        } else {
            tasks = tasks.filter(
                (task) =>
                    task.owner._id.toString() === req.user._id.toString() &&
                    task.completed === completed
            );
        }
        if (
            parseInt(req.query.page) > 0 &&
            parseInt(req.query.page) !== NaN &&
            parseInt(req.query.limit) !== NaN
        ) {
            tasks = tasks.splice(
                (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
                parseInt(req.query.limit)
            );
        }
        res.send({
            count: tasks.length,
            tasks,
        });
    } catch (error) {
        // console.log(error);
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
        if (!(task.owner._id.toString() === req.user._id.toString())) {
            return res.status(404).send();
        }
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
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) {
            return res.status(404).send('Task not found!');
        }
        if (!(task.owner._id.toString() === req.user._id.toString())) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });
        await task.save();
        res.send(task);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) {
            return res.status(404).send('Task not found!');
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
