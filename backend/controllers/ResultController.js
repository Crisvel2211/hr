import Result from "../models/resultModel.js";
import Question from "../models/questionModel.js";
import UserSelection from "../models/userSelection.js";

/**
 * ✅ Submit a quiz result
 */
export const submitQuizResult = async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;

    // ✅ Find User Selection
    const userSelection = await UserSelection.findOne({ users: userId, quizzes: quizId });

    if (!userSelection) {
      return res.status(400).json({ success: false, message: "User not assigned to quiz." });
    }

    // ✅ Check if the user has already submitted the quiz
    const existingResult = await Result.findOne({ userSelectionId: userSelection._id });
    if (existingResult) {
      return res.status(403).json({ success: false, message: "You have already submitted this quiz." });
    }

    let startTime = new Date(); // Set new start time

    // ✅ Enrich answers with full question details & calculate score
    let totalScore = 0;
    const enrichedAnswers = [];

    for (let ans of answers) {
      const question = await Question.findById(ans.questionId);

      if (question) {
        const isCorrect = question.correctAnswer === ans.selectedAnswer;
        if (isCorrect) totalScore += 1;

        // Add full question details to the answer
        enrichedAnswers.push({
          questionId: question._id,
          question: question.question,
          options: question.options,
          selectedAnswer: ans.selectedAnswer,
          isCorrect: isCorrect,
        });
      }
    }

    // ✅ Calculate Time Taken
    const timeTaken = Math.floor((new Date() - startTime) / 1000); // Difference in seconds

    // ✅ Save the result with enriched answers
    const newResult = new Result({
      userSelectionId: userSelection._id,
      answers: enrichedAnswers, // Store enriched answers
      score: totalScore,
      startTime: startTime, // Save when quiz started
      timeTaken: timeTaken, // Auto-calculated
    });

    await newResult.save();

    return res.status(201).json({
      success: true,
      message: "Quiz result submitted successfully!",
      result: newResult,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error submitting quiz", error: error.message });
  }
};

/**
 * ✅ Get all results
 */
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate("userSelectionId");
    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching results", error: error.message });
  }
};

/**
 * ✅ Get a single result by ID
 */
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("userSelectionId");
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching result", error: error.message });
  }
};

/**
 * ✅ Get all results for a specific user
 */
export const getResultsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userSelections = await UserSelection.find({ users: userId });

    if (!userSelections.length) {
      return res.status(404).json({ success: false, message: "No quizzes found for this user" });
    }

    const userSelectionIds = userSelections.map(us => us._id);
    const results = await Result.find({ userSelectionId: { $in: userSelectionIds } }).populate("userSelectionId");

    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching results", error: error.message });
  }
};

export const getResultsByQuizId = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userSelections = await UserSelection.find({ quizzes: quizId });

    if (!userSelections.length) {
      return res.status(404).json({ success: false, message: "No results found for this quiz" });
    }

    const userSelectionIds = userSelections.map(us => us._id);
    const results = await Result.find({ userSelectionId: { $in: userSelectionIds } }).populate("userSelectionId");

    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching results", error: error.message });
  }
};



/**
 * ✅ Update a quiz result
 */
export const updateResult = async (req, res) => {
  try {
    const updatedResult = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedResult) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    return res.status(200).json({ success: true, message: "Result updated successfully!", result: updatedResult });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating result", error: error.message });
  }
};

/**
 * ✅ Delete a quiz result
 */
export const deleteResult = async (req, res) => {
  try {
    const deletedResult = await Result.findByIdAndDelete(req.params.id);

    if (!deletedResult) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    return res.status(200).json({ success: true, message: "Result deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting result", error: error.message });
  }
};


export const getAllUserQuizPerformances = async (req, res) => {
  try {
    // ✅ Get all unique user IDs from UserSelection
    const userSelections = await UserSelection.find().distinct("users");

    if (!userSelections.length) {
      return res.status(404).json({ success: false, message: "No users found with quiz attempts" });
    }

    const performanceData = [];

    for (const userId of userSelections) {
      // ✅ Find all quiz attempts by the user
      const userSelectionsByUser = await UserSelection.find({ users: userId });

      // ✅ Extract UserSelection IDs
      const userSelectionIds = userSelectionsByUser.map(us => us._id);

      // ✅ Fetch all results for this user
      const results = await Result.find({ userSelectionId: { $in: userSelectionIds } });

      if (results.length) {
        // ✅ Calculate total score & total quizzes
        const totalQuizzes = results.length;
        const totalScore = results.reduce((sum, result) => sum + result.score, 0);

        // ✅ Compute Performance Percentage
        const maxScorePerQuiz = 5; // Change this based on your quiz scoring system
        const maxPossibleScore = totalQuizzes * maxScorePerQuiz;
        const performancePercentage = (totalScore / maxPossibleScore) * 100;

        // ✅ Determine Promotion Eligibility (above 50%)
        const isEligibleForPromotion = performancePercentage > 50;
        const promotionMessage = isEligibleForPromotion 
          ? "✅ Qualified for Promotion 🎉" 
          : "❌ Not Qualified for Promotion";

        performanceData.push({
          userId,
          totalQuizzes,
          totalScore,
          performancePercentage: performancePercentage.toFixed(2) + "%",
          isEligibleForPromotion, // ✅ Added eligibility status
          promotionMessage,       // ✅ Message for clarity
        });
      }
    }

    if (!performanceData.length) {
      return res.status(404).json({ success: false, message: "No performance data found" });
    }

    return res.status(200).json({ success: true, performanceData });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error retrieving performances", error: error.message });
  }
};






