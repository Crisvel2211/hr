// models/Quiz.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const quizSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // References to Question documents
  createdDate: { type: Date, default: Date.now }, // 
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
