const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'rejected'],
        default: 'applied',
        required: true,
    },
    resume: {
        type: String,
        trim: true,
        default: '',
    },
}, { timestamps: true });

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
