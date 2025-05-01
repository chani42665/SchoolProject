const mongoose = require('mongoose');

const teacherModel = new mongoose.Schema({
    teacherId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], 
    role: { type: String, enum: ['admin', 'teacher'], default: 'teacher' },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Teacher', teacherModel);
