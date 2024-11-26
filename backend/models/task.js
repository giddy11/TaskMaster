const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    deadline: {
        type: Date,
        get: (value) => {
            // Return the date in 'YYYY-MM-DD' format
            return value ? value.toISOString().split('T')[0] : value;
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure the `get` method is used when returning data
TaskSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Task', TaskSchema);
