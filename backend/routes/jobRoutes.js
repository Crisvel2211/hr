import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob,
  getFilteredJobs
} from '../controllers/jobController.js';

const router = express.Router();

router.post('/', createJob);         // Create job
router.get('/', getJobs);            // Get all jobs
router.put('/:id', updateJob);       // Update job
router.delete('/:id', deleteJob);    // Delete job
router.post('/:id/apply', applyJob);
router.get("/filter", getFilteredJobs); // Apply for job
router.get('/:id', getJobById);  

export default router;
