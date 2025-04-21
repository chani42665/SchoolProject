const mongoose = require('mongoose');

const studentModel = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    role: { type: String, enum: ['student'], default: 'student' }, // שדה role
    password : String
});

module.exports = mongoose.model('Student', studentModel);
