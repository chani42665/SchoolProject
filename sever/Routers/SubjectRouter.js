const express = require("express")
const router = express.Router()
const { verify, authorizeRoles } = require("../Middlewares/auth")
const {getSubjectById,deleteSubject,updateSubject,createSubject,getSubjects,getSubjectsByTeacherId}=require("../Controllers/SubjectController")
router.post("/createSubject", createSubject)
router.get("/getSubjects", getSubjects)
router.get("/getSubjectById/:id", getSubjectById)
router.get("/getSubjectsByTeacherId/:teacherId", getSubjectsByTeacherId)
router.put("/updateSubject/:id",  updateSubject)
router.delete("/deleteSubject/:id",  deleteSubject)

module.exports = router;
