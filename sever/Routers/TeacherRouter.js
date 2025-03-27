const express = require("express")
const router = express.Router()

const {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    getTeachersByClassId,
    updateTeacher,
    deleteTeacher
} = require("../Controllers/TeacherController")

router.post("/createTeacher", createTeacher)
router.get("/getAllTeachers", getAllTeachers)
router.get("/getTeacherById/:teacherId", getTeacherById)
router.get("/getTeachersByClassId/:classId", getTeachersByClassId);
router.put("/updateTeacher", updateTeacher);
router.delete("/deleteTeacher/:teacherId", deleteTeacher);

module.exports = router