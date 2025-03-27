import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz
} from '../controllers/QuizController.js';

const router = express.Router();

// Create a new quiz
router.post('/create', createQuiz);

// Get all quizzes
router.get('/', getAllQuizzes);

// Get a single quiz by ID
router.get('/:id', getQuizById);

// Update a quiz by ID
router.put('/:id', updateQuiz);

// Delete a quiz by ID
router.delete('/:id', deleteQuiz);

export default router;
