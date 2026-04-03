const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    resume: {
        type: String,
        required: true,
        trim: true,
        match: [/^https?:\/\/.+/, 'Please provide a valid URL for resume'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
