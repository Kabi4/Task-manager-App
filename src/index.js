require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const ConnectionURL = process.env.MONGODB_URL.replace(
    '<password>',
    process.env.MONGODB_PASSWORD
);
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
const express = require('express');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');
// const User = require('./models/User');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/task', taskRouter);

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
