import express from 'express';
import trackApplications from '../controllers/trackApplications.js';

const router = express.Router();

// Route to get all applications
router.get('/track', trackApplications);

// Route to get applications for a specific user
router.get('/track/:userId', trackApplications);

export default router;
