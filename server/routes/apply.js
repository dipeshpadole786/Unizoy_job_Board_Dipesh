const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');

// GET /apply - Fetch all applications (admin only)
router.get('/', async (req, res, next) => {
    try {
        const applications = await Application.find().populate('jobId', 'title').sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        next(error);
    }
});

// POST /apply - Submit a job application
router.post('/', async (req, res, next) => {
    try {
        const { jobId, name, email, resume } = req.body;

        if (!jobId || !name || !email || !resume) {
            return res.status(400).json({ message: 'jobId, name, email, and resume link are required' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const application = new Application({ jobId, name, email, resume });
        const savedApplication = await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application: savedApplication });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
