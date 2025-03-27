import mongoose from "mongoose";

const interviewScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Candidate/User reference
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true }, // Job reference
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true }, // Candidate application reference
  interviewDate: { type: Date, required: true }, // Scheduled interview date
  meetingLink: { type: String, default: "" }, // Video call link (if online)
  status: { 
    type: String, 
    enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"], 
    default: "Scheduled" 
  }, // Interview status
}, { timestamps: true });

const Interview = mongoose.model("InterviewSchedule", interviewScheduleSchema);

export default Interview;
