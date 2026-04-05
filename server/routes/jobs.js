const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const {
  listJobs,
  getJobById,
  createJob,
  listMyJobs,
} = require('../controllers/jobController');

const router = express.Router();

// GET /api/jobs - list jobs (public)
router.get('/', listJobs);

// GET /api/jobs/admin/mine - jobs created by current admin
router.get('/admin/mine', auth, requireRole('admin'), listMyJobs);

// POST /api/jobs - create job (admin)
router.post('/', auth, requireRole('admin'), createJob);

// GET /api/jobs/:id - job details (public)
router.get('/:id', getJobById);

module.exports = router;
