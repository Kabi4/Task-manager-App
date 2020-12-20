const mongoose = require('mongoose');
// const validator = require('validator');

const TaskSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String,
        trim: true,
        unique: [true, 'Task Must have Unique Names'],
        minlength: [6, 'Task Must have a min length of 6 Words'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
});

TaskSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'owner',
        select: 'name',
    });
    next();
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
