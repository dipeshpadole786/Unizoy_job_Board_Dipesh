const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET /jobs - Fetch all job postings
router.get('/', async (req, res, next) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        next(error);
    }
});
// GET /jobs/:id - Fetch one job by ID
router.get('/:id', async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        next(error);
    }
});
// POST /jobs - Create a new job posting
router.post('/', async (req, res, next) => {
    try {
        const { title, description, location } = req.body;

        if (!title || !description || !location) {
            return res.status(400).json({ message: 'Title, description, and location are required' });
        }

        const job = new Job({ title, description, location });
        const savedJob = await job.save();
        res.status(201).json(savedJob);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
