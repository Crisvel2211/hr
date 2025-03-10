import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';

export const createApplication = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const resumePath = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user has already applied for this job
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Create new application
    const newApplication = new Application({
      ...req.body,
      resume: resumePath,
    });

    const savedApplication = await newApplication.save();

    // Update the Job model to track applied users
    job.appliedUsers.push(userId);
    await job.save();

    res.status(201).json({ message: "Job application submitted successfully", application: savedApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

    

export const updateApplication = async (req, res) => {
    try {
      const { id } = req.params;
      const resumePath = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.resume;
  
      const updatedApplication = await Application.findByIdAndUpdate(
        id,
        { ...req.body, resume: resumePath },
        { new: true }
      );
  
      if (!updatedApplication) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      res.status(200).json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Get All Applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('userId jobId');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id).populate('userId jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedApplication = await Application.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
