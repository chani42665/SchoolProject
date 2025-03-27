const express = require("express")
const router = express.Router()

const { createGrade, getAllGrades, getGradeById, getGradesByStudentId, deleteGradeById, updateGradeById } = require("../Controllers/GradeController")

router.post("/createGrade", createGrade)
router.get("/getAllGrades", getAllGrades)
router.get("/getGradeById/:gradeId", getGradeById)
router.get("/getGradesByStudentId/:studentId", getGradesByStudentId)
router.delete("/deleteGradeById/:gradeId", deleteGradeById)
router.put("/updateGradeById", updateGradeById)

module.exports = router