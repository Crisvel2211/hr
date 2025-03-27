// models/Question.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const optionSchema = new Schema({
  optionText: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [optionSchema], // Array of options
  correctAnswer: { type: String, required: true }, // Store the correct answer for validation
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
