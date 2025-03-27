const express = require("express")
const router = express.Router()

const {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentsByClassId,
    updateStudent,
    deleteStudent
} = require("../Controllers/StudentController")

router.post("/createStudent", createStudent)
router.get("/getAllStudents", getAllStudents)
router.get("/getStudentById/:studenId", getStudentById)
router.get("/getStudentsByClassId/:classId", getStudentsByClassId)
router.put("/updateStudent", updateStudent)
router.delete("/deleteStudent/:studentId", deleteStudent);

module.exports = router