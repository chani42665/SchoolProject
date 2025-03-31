const mongoose = require('mongoose');

const teacherModel = new mongoose.Schema({
    teacherId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subjects: [{ type: String, required: true }],
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    isAdmain: { type: Boolean, default: false },
});

module.exports = mongoose.model('Teacher', teacherModel);
