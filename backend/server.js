import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import routeEmployee from "./routes/authEmployee.js"; 
import mongoDb from "./config/mongoDb.js";
import jobRoutes from "./routes/jobRoutes.js"
import employeeDetailsRoutes from "./routes/employeeDetailsRoutes.js";
import applicationRoutes from './routes/applicationRoutes.js';
import applicationTrack from './routes/applicantionTrack.js';
import interviewRoutes from "./routes/interviewScheduleRoutes.js";
import quizRoutes from './routes/quizRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import userSelectionRoutes from './routes/userSelectionRoutes.js';
import promotionRoutes from "./routes/promotionRoutes.js";
import shiftRoutes from "./routes/shift.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
mongoDb();



const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/employee", routeEmployee);
app.use("/api/employeedetails", employeeDetailsRoutes);
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', applicationTrack); 
app.use("/api/interviews", interviewRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/result', resultRoutes);
app.use('/api/user-selections', userSelectionRoutes); 
app.use("/api/promotions", promotionRoutes);
app.use("/api/shifts", shiftRoutes);

app.get('/', (req, res) => {
    res.send('backend is running')
})

  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
