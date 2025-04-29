const express = require("express")
const router = express.Router()
const { verify, authorizeRoles } = require("../Middlewares/auth")

const {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentsByClassId,
    updateStudent,
    deleteStudent
} = require("../Controllers/StudentController")

router.post("/createStudent",createStudent)
router.get("/getAllStudents",getAllStudents)
router.get("/getStudentById/:studenId",verify, authorizeRoles("admin","teacher"), getStudentById)
router.get("/getStudentsByClassId/:classId",verify, authorizeRoles("admin","teacher"), getStudentsByClassId)
router.put("/updateStudent/:id", updateStudent)
router.delete("/deleteStudent/:studentId", deleteStudent);

module.exports = router