const express = require("express")
const router = express.Router()
const { verify, authorizeRoles } = require("../Middlewares/auth")
const { createExam, getAllExams, getExamByClassId, updateExam, deleteExam, sendExamReminder } = require("../Controllers/ExamController")

router.post("/createExam", verify, authorizeRoles("admin","teacher"), createExam)
router.get("/getAllExams", verify, authorizeRoles("admin","teacher"), getAllExams)
router.get("/getExamByClassId/:classId", verify, authorizeRoles("admin","teacher","student"), getExamByClassId)
router.put("/updateExam", verify, authorizeRoles("admin","teacher"),updateExam)
router.delete("/deleteExam/:examId",verify, authorizeRoles("admin","teacher"), deleteExam)
router.post("/sendExamReminder",verify, authorizeRoles("admin","teacher"), sendExamReminder)

module.exports = router