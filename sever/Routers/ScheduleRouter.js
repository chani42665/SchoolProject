const express = require('express');
const router = express.Router();


const { createSchedule, getTeacherSchedule, updateSchedule, deleteSchedule ,getAllSchedules} = require("../Controllers/scheduleController")

router.post('/createSchedule', createSchedule)
router.get('/getTeacherSchedule/:teacherId', getTeacherSchedule)
router.get('/getAllSchedules/', getAllSchedules)
router.put('/updateSchedule/:scheduleId', updateSchedule)
router.delete('/deleteSchedule/:scheduleId', deleteSchedule)
module.exports = router
