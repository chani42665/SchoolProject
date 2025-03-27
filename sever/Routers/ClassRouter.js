const express = require("express")
const router = express.Router()
const { createClass, getAllClasses, addStudentToClass, addTeacherToClass, updateClass, removeStudentFromClass, removeTeacherFromClass } = require("../Controllers/CalssController")


router.post("/createClass", createClass)
router.get("/getAllClasses", getAllClasses)
router.put("/addStudentToClass/:studenId", addStudentToClass)
router.put("/addTeacherToClass/:teacherId", addTeacherToClass)
router.put("/updateClass", updateClass)
router.delete("/removeStudentFromClass/:studenId", removeStudentFromClass)
router.delete("/removeTeacherFromClass/:teacherId", removeTeacherFromClass)

module.exports = router