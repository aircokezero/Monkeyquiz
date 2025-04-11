const profiles = require('../models/Profiles');
const StudentClass = require("../models/StudentClass"); 
const Classroom = require("../models/Classroom");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingEmail = await profiles.findOne({ email });
    const existingUsername = await profiles.findOne({username})
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });
    if (existingUsername) return res.status(400).json({ message: "Username already exists" });
    const salt = await bcrypt.genSalt(10);
    const hpass = await bcrypt.hash(password,salt);
    const newUser = new profiles({ username, email, password:hpass, role });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const puser = { id: newUser._id, username: newUser.username, role: newUser.role };
    res.status(201).json({token ,puser, message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const login = async(req,res)=>{
  const {username,password}=req.body;
  try{
    const user = await profiles.findOne({username});
    if(!user) return res.status(400).json({ error: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const puser = { id: user._id, username: user.username, role: user.role };
    res.json({token ,puser});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const createClass = async (req, res) => {
  try {
    console.log("🔹 Received request to create classroom:", req.body);
    const { name, code, createdBy } = req.body;
    if (!name || !code || !createdBy) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }
    const classroom = new Classroom({ name, code, createdBy });
    await classroom.save();
    console.log("✅ Classroom saved successfully:", classroom);
    const allClassrooms = await Classroom.find();
    console.log("📌 All classrooms in DB:", allClassrooms);
    res.status(201).json(classroom);
  } catch (error) {
    console.error("❌ Error saving classroom:", error);
    res.status(500).json({ error: "Error creating classroom", details: error.message });
  }
};

const joinClass = async (req, res) => {
  try {
    const { studentId, username, classroomCode } = req.body;
    const classroom = await Classroom.findOne({ code: classroomCode });
    if (!classroom) return res.status(400).json({ error: "Classroom not found" });
    const existingEntry = await StudentClass.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),  
      classroomId: classroom._id,
    });
    if (existingEntry) return res.status(400).json({ error: "Already joined" });
    const studentClassroom = new StudentClass({
      studentId: new mongoose.Types.ObjectId(studentId),
      username,
      classroomId: classroom._id,
    });
    await studentClassroom.save();
    res.status(201).json(studentClassroom);
  } catch (error) {
    console.error("Error joining classroom:", error);
    res.status(500).json({ error: "Error joining classroom" });
  }
};


const alrjoined = async (req, res) => {
  try {
    console.log("Fetching classrooms for student:", req.params.id);
    const studentClassrooms = await StudentClass.find({ studentId: req.params.id });
    if (studentClassrooms.length === 0) {
      return res.status(200).json([]); 
    }
    const classroomIds = studentClassrooms.map((sc) => sc.classroomId);
    const classrooms = await Classroom.find({ _id: { $in: classroomIds } });
    if (classrooms.length === 0) {
      return res.status(200).json([]); 
    }
    res.json(classrooms);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ error: error.message });
  }
};


const fetchteachClass = async(req,res) =>{
  try {
    const classrooms = await Classroom.find({ createdBy: req.params.teacherId });
    res.json(classrooms);
} catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ message: "Server Error" });
}
};

const fetchstudClass = async(req,res) =>{
  try {
    const classrooms = await Classroom.find({ students: req.params.studentId });
    res.json(classrooms);
} catch (error) {
    console.error("Error fetching joined classrooms:", error);
    res.status(500).json({ message: "Server Error" });
}
};





module.exports = { signup,login,createClass,joinClass,alrjoined,fetchteachClass,fetchstudClass };
