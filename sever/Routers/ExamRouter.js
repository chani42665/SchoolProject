const express = require("express")
const router = express.Router()
const { createExam, getAllExams, getExamByClassId, updateExam, deleteExam, sendExamReminder } = require("../Controllers/ExamController")

router.post("/createExam", createExam)
router.get("/getAllExams", getAllExams)
router.get("/getExamByClassId/:classId", getExamByClassId)
router.put("/updateExam", updateExam)
router.delete("/deleteExam/:examId", deleteExam)
router.post("/sendExamReminder", sendExamReminder)

module.exports = router