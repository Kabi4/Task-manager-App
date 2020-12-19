const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
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

userSchema.statics.findAndAuthenticate = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid Email or password!');
    }
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
        throw new Error('Invalid Email or password!');
    }
    return user;
};

//Passwrod Hashing
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
