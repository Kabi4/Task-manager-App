const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./Task');

const userSchema = new mongoose.Schema(
    {
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
            select: false,
        },
        avatar: {
            type: Buffer,
            select: false,
        },
        tokens: {
            type: [
                {
                    token: {
                        type: String,
                    },
                },
            ],
            select: false,
        },
        admin: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
);

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
});

userSchema.methods.getAuthToken = async function () {
    const token = await jwt.sign(
        { _id: this._id.toString() },
        process.env.JWT_SECERET_KEY,
        { expiresIn: process.env.JWT_EXPRIES_IN }
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

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

// userSchema.post(/^find/, async function () {
//     console.log(this);
//     await this.populate({
//         path: 'tasks',
//         select: 'description completed -owner',
//     });
// });

userSchema.pre('remove', async function (next) {
    // await this.populate({
    //     path: 'tasks',
    //     select: 'description completed -owner',
    // }).execPopulate();
    // const allTasks = this.tasks.map((ele) => ele._id);

    await Task.deleteMany({ owner: this._id });

    next();
});

// userSchema.pre(/^find/, async function (next) {
//     this.populate({
//         path: 'tasks',
//         select: 'description completed -owner',
//     });
//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
