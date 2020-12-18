const mongoose = require('mongoose');
// const validator = require('validator');

const ConnectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

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

// const User = mongoose.model('User', {
//     name: {
//         required: true,
//         type: String,
//         trim: true,
//     },
//     age: {
//         type: Number,
//         validate(value) {
//             if (value < 0) {
//                 throw Error('Age must be Positive');
//             }
//         },
//     },
//     email: {
//         type: String,
//         lowercase: true,
//         unique: true,
//         trim: true,
//         required: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw Error('Invalid Email provided');
//             }
//         },
//     },
//     password: {
//         required: true,
//         type: String,
//         minLength: 6,
//         trim: true,
//         validate(value) {
//             if (
//                 value.includes('password') ||
//                 value.includes('Password') ||
//                 value.includes('PASSWORD')
//             ) {
//                 throw Error('Such a pathetic password try something else!');
//             }
//         },
//     },
// });

// const me = new User({
//     name: 'Kushagra Singh',
//     age: 12,
//     email: 'hy@gmail.com',
//     password: 'xasas3',
// });

// me.save()
//     .then(() => {
//         console.log(me);
//     })
//     .catch((err) => {
//         console.log(err);
//         process.exit();
//     });

// const Task = mongoose.model('Task', {
//     description: {
//         required: true,
//         type: String,
//         trim:true,
//         unique: [true, 'Task Must have Unique Names'],
//     },
//     completed: {
//         type: Boolean,
//         default: false,
//     },
// });

// const myTask = new Task({
//     description: 'Learn NodeJS Advance',
//     completed: false,
// });

// myTask
//     .save()
//     .then(() => {
//         console.log(myTask);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
