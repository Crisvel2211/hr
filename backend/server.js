import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import routeEmployee from "./routes/authEmployee.js"; 
import mongoDb from "./config/mongoDb.js";

dotenv.config();
mongoDb();



const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/employee", routeEmployee);
// Routes
app.use("/api/auth", authRoutes);


  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
