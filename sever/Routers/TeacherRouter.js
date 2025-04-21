const express = require("express")
const router = express.Router()
const { verify, authorizeRoles } = require("../Middlewares/auth")

const {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    getTeachersByClassId,
    updateTeacher,
    deleteTeacher
} = require("../Controllers/TeacherController")

router.post("/createTeacher",verify, authorizeRoles("admin"), createTeacher)
router.get("/getAllTeachers", verify, authorizeRoles("admin"),getAllTeachers)
router.get("/getTeacherById/:teacherId",verify, authorizeRoles("admin"), getTeacherById)
router.get("/getTeachersByClassId/:classId",verify, authorizeRoles("admin"), getTeachersByClassId);
router.put("/updateTeacher",verify, authorizeRoles("admin"), updateTeacher);
router.delete("/deleteTeacher/:teacherId",verify, authorizeRoles("admin"), deleteTeacher);

module.exports = router