const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');

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
