import mongoose from 'mongoose';
import moment from 'moment-timezone';

// Function to get local date in ISO format
const getLocalDate = () => {
  return moment().tz("Asia/Manila").toDate(); // ✅ Use `.toDate()` for MongoDB Date type
};

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  responseTime: { type: String },
  jobType: { type: String, required: true },
  activeDate: { type: Date, default: getLocalDate }, // ✅ Use Date instead of String
  location: { type: String, required: true },
  salary: { type: String, required: true },
  employmentType: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  appliedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
