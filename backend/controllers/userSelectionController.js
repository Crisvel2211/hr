import mongoose from "mongoose";
import UserSelection from '../models/userSelection.js';
import Quiz from '../models/quizModel.js';
import User from '../models/employeeModel.js'; // Ensure this matches your model name

export const createUserSelection = async (req, res) => {
  try {
    const { quizzes, users } = req.body;

    if (!Array.isArray(quizzes) || !Array.isArray(users) || quizzes.length === 0 || users.length === 0) {
      return res.status(400).json({ message: 'Quizzes and Users must be non-empty arrays' });
    }

    const quizIds = await Promise.all(
      quizzes.map(async (quiz) => {
        const foundQuiz = await Quiz.findOne({ title: { $regex: `^${quiz.title.trim()}$`, $options: "i" } }).lean();
        return foundQuiz ? foundQuiz._id : null;
      })
    );

    const userIds = await Promise.all(
      users.map(async (user) => {
        const foundUser = await User.findOne({ email: { $regex: `^${user.email.trim()}$`, $options: "i" } }).lean();
        return foundUser ? foundUser._id : null;
      })
    );

    const missingQuizzes = quizzes.filter((_, index) => quizIds[index] === null);
    const missingUsers = users.filter((_, index) => userIds[index] === null);

    if (missingQuizzes.length > 0 || missingUsers.length > 0) {
      return res.status(400).json({ 
        message: 'Some quizzes or users were not found', 
        missingQuizzes, 
        missingUsers 
      });
    }

    const newUserSelection = new UserSelection({ quizzes: quizIds, users: userIds });
    await newUserSelection.save();

    const populatedUserSelection = await UserSelection.findById(newUserSelection._id)
      .populate({ path: 'quizzes', select: 'title' })
      .populate({ path: 'users', select: 'email' });

    const formattedResponse = {
      message: 'User selection created successfully',
      data: {
        _id: populatedUserSelection._id,
        quizzes: populatedUserSelection.quizzes.map(quiz => ({ 
          id: quiz._id,
          title: quiz.title 
        })),
        users: populatedUserSelection.users.map(user => ({
          userId: user._id,
          email: user.email
        }))
      }
    };

    res.status(201).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user selection', error: error.message });
  }
};

// Get all User Selections
export const getAllUserSelections = async (req, res) => {
  try {
    const userSelections = await UserSelection.find()
      .populate({ path: 'quizzes', select: 'title' }) 
      .populate({ path: 'users', select: 'email' });

    const formattedResponse = userSelections.map(selection => ({
      ...selection.toObject(),
      users: selection.users.map(user => ({
        userId: user._id,
        email: user.email
      }))
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user selections', error: error.message });
  }
};

// Get User Selection by ID
export const getUserSelectionById = async (req, res) => {
  try {
    const userSelection = await UserSelection.findById(req.params.id)
      .populate({ path: 'quizzes', select: 'title' }) 
      .populate({ path: 'users', select: 'email' });

    if (!userSelection) {
      return res.status(404).json({ message: 'User selection not found' });
    }

    const formattedResponse = {
      ...userSelection.toObject(),
      users: userSelection.users.map(user => ({
        userId: user._id,
        email: user.email
      }))
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user selection', error: error.message });
  }
};

// Update User Selection
export const updateUserSelection = async (req, res) => {
  try {
    const { quizzes, users } = req.body;

    if (!Array.isArray(quizzes) || !Array.isArray(users) || quizzes.length === 0 || users.length === 0) {
      return res.status(400).json({ message: 'Quizzes and Users must be non-empty arrays' });
    }

    const quizIds = await Promise.all(
      quizzes.map(async (quiz) => {
        const foundQuiz = await Quiz.findOne({ title: { $regex: `^${quiz.title.trim()}$`, $options: "i" } }).lean();
        return foundQuiz ? foundQuiz._id : null;
      })
    );

    const userIds = await Promise.all(
      users.map(async (user) => {
        const foundUser = await User.findOne({ email: { $regex: `^${user.email.trim()}$`, $options: "i" } }).lean();
        return foundUser ? foundUser._id : null;
      })
    );

    if (quizIds.includes(null) || userIds.includes(null)) {
      return res.status(400).json({ message: 'Some quizzes or users were not found' });
    }

    const updatedUserSelection = await UserSelection.findByIdAndUpdate(
      req.params.id,
      { quizzes: quizIds, users: userIds },
      { new: true, runValidators: true }
    )
      .populate({ path: 'quizzes', select: 'title' }) 
      .populate({ path: 'users', select: 'email' });

    if (!updatedUserSelection) {
      return res.status(404).json({ message: 'User selection not found' });
    }

    res.status(200).json({ message: 'User selection updated', data: updatedUserSelection });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user selection', error: error.message });
  }
};

// Delete User Selection
export const deleteUserSelection = async (req, res) => {
  try {
    const deletedSelection = await UserSelection.findByIdAndDelete(req.params.id);
    if (!deletedSelection) {
      return res.status(404).json({ message: 'User selection not found' });
    }
    res.status(200).json({ message: 'User selection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user selection', error: error.message });
  }
};


export const getQuizzesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    // Find all user selections where the userId is present
    const userSelections = await UserSelection.find({ users: userId }).populate("quizzes");

    if (!userSelections.length) {
      return res.status(404).json({ success: false, message: "No quizzes assigned to this user." });
    }

    // Extract quizzes, remove duplicates using a Set
    const quizzes = [];
    const quizSet = new Set();

    userSelections.forEach(selection => {
      selection.quizzes.forEach(quiz => {
        if (!quizSet.has(quiz._id.toString())) {
          quizSet.add(quiz._id.toString());
          quizzes.push(quiz);
        }
      });
    });

    return res.status(200).json({ success: true, quizzes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching quizzes", error: error.message });
  }
};
