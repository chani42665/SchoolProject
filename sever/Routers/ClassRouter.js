const express = require("express")
const { verify, authorizeRoles } = require("../Middlewares/auth")

const router = express.Router()
const { createClass, getAllClasses,getClassById,getClassByStudentId, addStudentToClass, addTeacherToClass, updateClass, removeStudentFromClass, removeTeacherFromClass } = require("../Controllers/CalssController")


router.post("/createClass", createClass)
router.get("/getAllClasses", getAllClasses)
router.get("/getClassById/:classId", getClassById)
router.get("/getClassByStudentId/:studentId", getClassByStudentId)
// router.put("/addStudentToClass/:studentId",verify, authorizeRoles("admin"), addStudentToClass)
// router.put("/addTeacherToClass/:teacherId",verify, authorizeRoles("admin"), addTeacherToClass)
router.put("/updateClass", verify, authorizeRoles("admin"),updateClass)
router.delete("/removeStudentFromClass/:studentId",verify, authorizeRoles("admin"), removeStudentFromClass)
router.delete("/removeTeacherFromClass/:teacherId",verify, authorizeRoles("admin"), removeTeacherFromClass)

module.exports = router