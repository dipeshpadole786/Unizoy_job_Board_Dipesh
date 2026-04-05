const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');

const router = express.Router();

// POST /api/applications/apply (user)
router.post('/apply', auth, requireRole('user', 'admin'), applyToJob);

// GET /api/applications/my (user)
router.get('/my', auth, requireRole('user', 'admin'), getMyApplications);

// GET /api/applications/job/:jobId (admin)
router.get('/job/:jobId', auth, requireRole('admin'), getApplicationsByJob);

// PUT /api/applications/:id/status (admin)
router.put('/:id/status', auth, requireRole('admin'), updateApplicationStatus);

module.exports = router;

