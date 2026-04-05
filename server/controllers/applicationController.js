const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Valid jobId is required' });
    }

    const job = await Job.findById(jobId).select('_id');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const resume = (req.user.resume || '').trim();

    try {
      const created = await Application.create({ userId, jobId, resume });
      return res.status(201).json({ message: 'Applied successfully', application: created });
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({ message: 'You have already applied to this job' });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const apps = await Application.find({ userId })
      .populate('jobId', 'title company location createdAt')
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    next(error);
  }
};

const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Valid jobId is required' });
    }

    const apps = await Application.find({ jobId })
      .populate('userId', 'name email role resume createdAt')
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Valid application id is required' });
    }
    if (!['shortlisted', 'rejected', 'applied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('userId', 'name email resume')
      .populate('jobId', 'title company');

    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Status updated', application: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
};

