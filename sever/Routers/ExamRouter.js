const express = require("express")
const router = express.Router()
const { verify, authorizeRoles } = require("../Middlewares/auth")
const { createExam, getAllExams,getExamById, getExamByClassId, updateExam, deleteExam,getExamsByClassAndTeacher,getExamsBySubjectAndClass ,getAvrageExam} = require("../Controllers/ExamController")

router.post("/createExam", createExam)
router.get("/getAllExams", getAllExams)
router.get("/getExamByClassId/:classId",getExamByClassId)
router.get("/getExamById/:examId", getExamById)
router.put("/updateExam/:examId", updateExam)
router.delete("/deleteExam/:examId", deleteExam)
router.get("/getExamsByClassAndTeacher/:classId/teacher/:teacherId",getExamsByClassAndTeacher)
router.get('/getExamsBySubjectAndClass/', getExamsBySubjectAndClass);
router.get('/getAvrageExam/:examId', getAvrageExam)

// router.post("/sendExamReminder",verify, authorizeRoles("admin","teacher"), sendExamReminder)

module.exports = router