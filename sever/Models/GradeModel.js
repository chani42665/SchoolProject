const mongoose = require('mongoose');

const gradeModel = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    grade: { type: Number, required: true },
});

module.exports = mongoose.model('Grade', gradeModel);
