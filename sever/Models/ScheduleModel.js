const mongoose = require('mongoose');

const scheduleModel = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    day: { type: String },
    time: { type: String, required: true },

});

module.exports = mongoose.model('Schedule', scheduleModel);
