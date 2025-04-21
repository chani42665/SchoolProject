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

router.post("/createStudent",verify, authorizeRoles("admin"),createStudent)
router.get("/getAllStudents", verify, authorizeRoles("admin","teacher"),getAllStudents)
router.get("/getStudentById/:studenId",verify, authorizeRoles("admin","teacher"), getStudentById)
router.get("/getStudentsByClassId/:classId",verify, authorizeRoles("admin","teacher"), getStudentsByClassId)
router.put("/updateStudent",verify, authorizeRoles("admin","teacher"), updateStudent)
router.delete("/deleteStudent/:studentId",verify, authorizeRoles("admin","teacher"), deleteStudent);

module.exports = router