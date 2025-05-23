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

router.post("/createStudent",verify, authorizeRoles("admin","teacher"),createStudent)
router.get("/getAllStudents",verify, authorizeRoles("admin","teacher"),getAllStudents)
router.get("/getStudentById/:studentId",verify, authorizeRoles("admin","teacher"), getStudentById)
router.get("/getStudentsByClassId/:classId",verify, authorizeRoles("admin","teacher"), getStudentsByClassId)
router.put("/updateStudent/:id", updateStudent)
router.delete("/deleteStudent/:studentId", deleteStudent);

module.exports = router