const express = require("express");
const { createClass,joinClass,alrjoined,fetchstudClass,fetchteachClass } = require("../controllers/authc");
const router = express.Router();
router.post("/", createClass);
router.post("/join", joinClass);
router.get("/student/alrjoined/:id", alrjoined);
router.get("/teacher/:teacherId",fetchteachClass);
router.get("/student/:studentId", fetchstudClass);


module.exports = router;