const User = require('../models/User');
const verifyToken = require('../middlewares/Auth');
const verifyAdmin = require('../middlewares/VerifyAdmin');
const router = require('express').Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, niklLaudeEmail } = require('../emails/account');

const cookieOptions = {
    expires: new Date(
        Date.now() +
            60 * 60 * 24 * 1000 * process.env.JWT_EXPRIES_IN.replace('d', '')
    ),
    httpOnly: true,
};

const upload = multer({
    // dest: 'images',
    limits: {
        fileSize: 4000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            cb(new Error('Please upload JPG,JPEG,PNG file types only!'));
        }
        cb(undefined, true);
    },
});

router.post('/signup', async (req, res) => {
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
        req.body.admin && req.body.admin == false;
        const newUser = await new User(contents).save();
        const token = await newUser.getAuthToken();
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        sendWelcomeEmail(newUser.email, newUser.name);
        res.cookie('jwt', token, cookieOptions);
        res.status(201).send({ newUser, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findAndAuthenticate(
            req.body.email,
            req.body.password
        );
        if (!user) {
            return res.status(404).send();
        }
        const token = await user.getAuthToken();
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', token, cookieOptions);
        res.send({ user, token });
    } catch (error) {
        // console.log(error);
        res.status(400).send(error);
    }
});

router.use(verifyToken);
router.post(
    '/me/avatar',
    upload.single('upload'),
    async (req, res) => {
        // console.log(req.file);
        //req.user.avatar = req.file.buffer;
        const buffer = await sharp(req.file.buffer)
            .resize(150, 150)
            .png()
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send({
            status: 'success',
            message: 'You avatar Succesfully uploaded',
        });
    },
    (error, req, res, next) => {
        res.status(400).json({
            error: error.message,
        });
    }
);

router.delete('/me/avatar', async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(204).send({
        status: 'success',
        message: 'You avatar Succesfully REmoved',
    });
});
router.get('/logout', async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );
        await req.user.save();
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', '', cookieOptions);
        res.send({ token: '' });
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/logoutallsesions', async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token === req.token
        );
        await req.user.save();
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', req.user.tokens[0].token, cookieOptions);
        res.send({ token: req.user.tokens[0].token });
    } catch (error) {
        res.status(500).send();
    }
});

router.delete('/me', async (req, res) => {
    const { name, email } = req.user;
    await req.user.remove();
    niklLaudeEmail(email, name);
    res.status(204).send();
});

router.get('/me', async (req, res) => {
    res.send({ user: req.user });
});

router.patch('/me', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) {
        return res
            .status(400)
            .send('A Sensitive information or invalid information sent!');
    }
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
            runValidators: true,
        });

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/me/updatepassword', async (req, res) => {
    // console.log('key', process.env.JWT_SECERET_KEY);
    try {
        req.user.password = req.body.newPassword;
        req.user.tokens = [];
        await req.user.save();
        const token = await req.user.getAuthToken();
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', req.user.tokens[0].token, cookieOptions);
        req.user.tokens[0].token;
        res.send({ user, token });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.use(verifyAdmin);

router.get('/me/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('+avatar');
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg').send(user.avatar);
    } catch (error) {
        // console.log(error);
        res.status(404).send({ error: 'No Avatar or user Found!' });
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
        res.status(500).send(error);
    }
});

router.patch('/updatepassword/:id', async (req, res) => {
    // console.log('key', process.env.JWT_SECERET_KEY);
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found!');
        }
        user.password = req.body.newPassword;
        user.tokens = [];
        await user.save();
        const token = await user.getAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(500).send(error);
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

// router.post('/signup',async (req,res)=>{
//     try{
//         if(!req.body.email||!req.body.password||!req.body.name||)
//     }catch(error){
//          console.log(error);
//         res.status(400).send(error);
//     }
// })

module.exports = router;
