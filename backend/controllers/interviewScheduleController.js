import InterviewSchedule from "../models/interviewModel.js";
import Application from "../models/applicationModel.js";

// 📌 Schedule an Interview
export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, interviewDate, meetingLink, status } = req.body;

    // Check if an interview already exists for the applicationId
    const existingInterview = await InterviewSchedule.findOne({ applicationId });
    if (existingInterview) {
      return res.status(400).json({ message: "An interview has already been scheduled for this application." });
    }

    // Fetch application details to get userId and jobId
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const interview = new InterviewSchedule({
      applicationId,
      userId: application.userId, // Extracted from Application
      jobId: application.jobId,   // Extracted from Application
      interviewDate,
      meetingLink,
      status,
    });

    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get all Interviews
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await InterviewSchedule.find()
      .populate("applicationId")
      .populate("userId")
      .populate("jobId"); // Fetch full job details

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get a Single Interview
export const getInterviewById = async (req, res) => {
  try {
    const interview = await InterviewSchedule.findById(req.params.id)
      .populate("applicationId")
      .populate("userId")
      .populate("jobId"); // Fetch full job details

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📌 Update Interview (Date, Meeting Link, or Status)
export const updateInterview = async (req, res) => {
  try {
    const { interviewDate, meetingLink, status } = req.body;
    const interview = await InterviewSchedule.findByIdAndUpdate(
      req.params.id,
      { interviewDate, meetingLink, status },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Delete an Interview
export const deleteInterview = async (req, res) => {
  try {
    const interview = await InterviewSchedule.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get a Single Interview by userId
export const getInterviewByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const interview = await InterviewSchedule.findOne({ userId })
      .populate("applicationId")
      .populate("jobId");

    if (!interview) {
      return res.status(404).json({ message: "No interview found for this user" });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

