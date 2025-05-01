const Schedule = require('../Models/ScheduleModel')
const Teacher=require('../Models/TeacherModel')

const createSchedule = async (req, res) => {
    try {
        const schedule = new Schedule(req.body);
        const { teacherId } = req.body;
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        await schedule.save();
        await Teacher.findByIdAndUpdate(teacherId, { $push: { schedules: schedule._id } });
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find()
        res.status(200).json(schedules)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};
const getTeacherSchedule = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const schedules = await Schedule.find({ teacherId }).populate('classId');
        res.status(200).json(schedules);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, req.body)
        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        await updatedSchedule.save()
        res.status(200).json(updatedSchedule)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);
        if (!deletedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        await Teacher.findByIdAndUpdate(deletedSchedule.teacherId, { $pull: { schedules: scheduleId } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    createSchedule,
    getTeacherSchedule,
    updateSchedule,
    deleteSchedule,
    getAllSchedules
};
