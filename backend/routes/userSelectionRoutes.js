import express from 'express';
import {
  createUserSelection,
  getAllUserSelections,
  getUserSelectionById,
  getQuizzesByUserId,
  updateUserSelection,
  deleteUserSelection
} from '../controllers/userSelectionController.js';

const router = express.Router();

router.post('/', createUserSelection); // Create new user selection
router.get('/', getAllUserSelections); // Get all user selections
router.get('/:id', getUserSelectionById);
router.get('/:userId/quizzes', getQuizzesByUserId); // Get user selection by ID
router.put('/:id', updateUserSelection); // Update user selection
router.delete('/:id', deleteUserSelection); // Delete user selection

export default router;
