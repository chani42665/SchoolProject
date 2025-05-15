const mongoose = require('mongoose');

const examModel = new mongoose.Schema({
    // examId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    examDate: { type: Date, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
});

module.exports = mongoose.model('Exam', examModel);
