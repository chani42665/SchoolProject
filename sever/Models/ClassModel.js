const mongoose = require('mongoose');

const classModel = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
});

module.exports = mongoose.model('Class', classModel);
