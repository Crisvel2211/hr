import mongoose from 'mongoose';

const userSelectionSchema = new mongoose.Schema(
  {
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz', // Reference to multiple Quiz IDs
        required: true
      }
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Reference to multiple users
        required: true
      }
    ]
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.model('UserSelection', userSelectionSchema);
