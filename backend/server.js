const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./models/db");
const authRoutes = require("./routes/authRoutes");
const classroomRoutes = require("./routes/class"); 
const quizRoutes = require("./routes/quizRoutes");
const classroomRoutesV2 = require("./routes/classroom"); 

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/classrooms", classroomRoutes); 
app.use("/api/classrooms/v2", classroomRoutesV2); 
app.use("/api", quizRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
