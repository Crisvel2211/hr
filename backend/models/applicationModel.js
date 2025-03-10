import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to the User model
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to the Job model
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  portfolio: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: 0
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  resume: {
    type: String, // URL or file path to the uploaded resume
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Interview Scheduled', 'Accepted', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
