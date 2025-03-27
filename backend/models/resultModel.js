import mongoose from "mongoose";

const { Schema } = mongoose;

const resultSchema = new Schema({
  userSelectionId: { type: Schema.Types.ObjectId, ref: "UserSelection", required: true },
  answers: [
    {
      questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
      selectedAnswer: { type: String },
      isCorrect: { type: Boolean, default: false },
    },
  ],
  score: { type: Number, required: true },
  startTime: { type: Date, default: null }, // Store quiz start time
  timeTaken: { type: Number, default: 0 }, // Auto-calculated
  completedDate: { type: Date, default: Date.now },
});


export default mongoose.model("Result", resultSchema);
 