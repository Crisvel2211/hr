import Job from '../models/jobModel.js';
import moment from 'moment-timezone';

// ✅ Create a new job
export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    // Convert activeDate to "YYYY-MM-DD" format with Asia/Manila timezone
    const formattedJobs = jobs.map(job => ({
      ...job._doc,
      activeDate: job.activeDate
        ? moment(job.activeDate).tz("Asia/Manila").format("YYYY-MM-DD")
        : null // Ensures no error if date is missing
    }));

    res.status(200).json(formattedJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ Get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Apply to a job
export const applyJob = async (req, res) => {
  try {
    const { userId } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.appliedUsers.includes(userId)) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    job.appliedUsers.push(userId);
    await job.save();
    res.status(200).json({ message: 'Job application submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
