const express = require("express")
const router = express.Router()
const { verify, authorizeRoles } = require("../Middlewares/auth")


const { createGrade, getAllGrades, getGradesByStudentId, deleteGrade, updateGrade } = require("../Controllers/GradeController")

router.post("/createGrade", createGrade)
router.get("/getAllGrades",getAllGrades)
// router.get("/getGradeById/:gradeId", getGradeById)
router.get("/getGradesByStudentId/:studentId", getGradesByStudentId)
router.delete("/deleteGrade/:gradeId", deleteGrade)
router.put("/updateGrade/:gradeId",  updateGrade)

module.exports = router