import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';

const trackApplications = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params (if provided)

    // Fetch applications based on userId (if provided)
    const applications = userId
      ? await Application.find({ userId }).lean()
      : await Application.find().lean();

    // Fetch all jobs
    const jobs = await Job.find().lean();

    // Map applications with job details
    const applicationData = applications.map(application => {
      const job = jobs.find(job => job._id.toString() === application.jobId.toString());
      return {
        userId: application.userId,
        jobTitle: job ? job.title : 'Unknown',
        company: job ? job.company : 'Unknown',
        location: job ? job.location : 'Unknown',
        salary: job ? job.salary : 'Unknown',
        status: application.status,
        appliedDate: application.createdAt,
      };
    });

    res.status(200).json({ success: true, data: applicationData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default trackApplications;
