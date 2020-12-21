const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');
const User = require('./models/User');

const app = express();

const PORT = process.env.PORT || 3000;
const ConnectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

app.use(express.json());

dotenv.config({ path: './config.env' });

app.use('/api/v1/user', userRouter);
app.use('/api/v1/task', taskRouter);

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

// (async () => {
//     const user = await User.findById('5fdecb433673b70ee059a270');
//     await user
//         .populate({
//             path: 'tasks',
//             select: 'description completed -owner',
//         })
//         .execPopulate();
//     console.log(user.tasks);
// })();
