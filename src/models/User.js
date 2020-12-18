const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    age: {
        type: Number,
        default: 15,
        validate(value) {
            if (value < 0) {
                throw Error('Age must be Positive');
            }
        },
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error('Invalid Email provided');
            }
        },
    },
    password: {
        required: true,
        type: String,
        minLength: 6,
        trim: true,
        validate(value) {
            if (
                value.includes('password') ||
                value.includes('Password') ||
                value.includes('PASSWORD')
            ) {
                throw Error('Such a pathetic password try something else!');
            }
        },
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
