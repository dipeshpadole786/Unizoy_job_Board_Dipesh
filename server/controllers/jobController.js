const mongoose = require('mongoose');
const Job = require('../models/Job');

const listJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Valid job id is required' });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const { title, company, description, location } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ message: 'title, description, and location are required' });
    }

    const createdBy = req.user?._id;
    const job = await Job.create({
      title: String(title).trim(),
      company: typeof company === 'string' ? company.trim() : '',
      description: String(description).trim(),
      location: String(location).trim(),
      createdBy,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

const listMyJobs = async (req, res, next) => {
  try {
    const adminId = req.user?._id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const jobs = await Job.find({ createdBy: adminId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listJobs,
  getJobById,
  createJob,
  listMyJobs,
};

