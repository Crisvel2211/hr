import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob
} from '../controllers/jobController.js';

const router = express.Router();

router.post('/', createJob);         // Create job
router.get('/', getJobs);            // Get all jobs
router.get('/:id', getJobById);      // Get single job
router.put('/:id', updateJob);       // Update job
router.delete('/:id', deleteJob);    // Delete job
router.post('/:id/apply', applyJob); // Apply for job

export default router;
