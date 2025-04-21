const express = require("express")
const router = express.Router()
const { verify, authorizeRoles } = require("../Middlewares/auth")


const { createGrade, getAllGrades, getGradeById, getGradesByStudentId, deleteGradeById, updateGradeById } = require("../Controllers/GradeController")

router.post("/createGrade", createGrade)
router.get("/getAllGrades", verify, authorizeRoles("admin","teacher"),getAllGrades)
router.get("/getGradeById/:gradeId", verify, authorizeRoles("admin","teacher","student"), getGradeById)
router.get("/getGradesByStudentId/:studentId", verify, authorizeRoles("admin","teacher","student"), getGradesByStudentId)
router.delete("/deleteGradeById/:gradeId", verify, authorizeRoles("admin","teacher"), deleteGradeById)
router.put("/updateGradeById", verify, authorizeRoles("admin","teacher"), updateGradeById)

module.exports = router