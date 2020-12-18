const User = require('../models/User');

const router = require('express').Router();

router.post('/', async (req, res) => {
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

router.get('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found!');
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
