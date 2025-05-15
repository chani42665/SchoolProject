const express = require("express")
const router = express.Router()
const { verify, authorizeRoles } = require("../Middlewares/auth")


const { createGrade, getAllGrades, getGradesByStudentId, deleteGrade, updateGrade } = require("../Controllers/GradeController")

router.post("/createGrade",verify, authorizeRoles("admin","teacher"), createGrade)
router.get("/getAllGrades",verify, authorizeRoles("admin","teacher"),getAllGrades)
// router.get("/getGradeById/:gradeId", getGradeById)
router.get("/getGradesByStudentId/:studentId",verify, authorizeRoles("admin","teacher"), getGradesByStudentId)
router.delete("/deleteGrade/:gradeId",verify, authorizeRoles("admin","teacher"), deleteGrade)
router.put("/updateGrade/:gradeId",verify, authorizeRoles("admin","teacher"),  updateGrade)

module.exports = router