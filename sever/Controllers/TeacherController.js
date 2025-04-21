const Teacher = require('../Models/TeacherModel');
const Class = require('../Models/ClassModel');
const Exam = require('../Models/ExamModel');


async function createTeacher(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // הצפנת הסיסמה
        const newTeacher = new Teacher({
            ...req.body,
            password: hashedPassword
        });
        
        if (!newTeacher.role) {
            newTeacher.role = 'teacher'; // ברירת מחדל ל-role
        }
        await newTeacher.save();

        res.status(200).json({ message: "Teacher created successfully", teacher: newTeacher });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// 📌 שליפת כל המורים
async function getAllTeachers(req, res) {
    try {
        const teachers = await Teacher.find()
            .populate('classes', 'name')
            .populate('exams', 'subject examDate');

        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 📌 שליפת מורה לפי ID
async function getTeacherById(req, res) {
    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findById(teacherId)
            .populate('classes', 'name')
            .populate('exams', 'subject examDate');

        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 📌 שליפת מורים לפי כיתה
async function getTeachersByClassId(req, res) {
    try {
        const { classId } = req.params;
        const teachers = await Teacher.find({ classes: classId });

        if (teachers.length === 0) {
            return res.status(404).json({ error: "No teachers found for this class" });
        }

        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 📌 עדכון מורה
async function updateTeacher(req, res) {
    try {
        const { teacherId } = req.params;
        const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, req.body, { new: true });

        if (!updatedTeacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 📌 מחיקת מורה
async function deleteTeacher(req, res) {
    try {
        const { teacherId } = req.params;
        const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

        if (!deletedTeacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        // הסרת המורה מרשימת המורים בכל הכיתות שבהן לימד
        await Class.updateMany({ teachers: teacherId }, { $pull: { teachers: teacherId } });

        // הסרת המורה מרשימת המבחנים שהוא יצר
        await Exam.updateMany({ teacherId }, { $unset: { teacherId: "" } });

        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    getTeachersByClassId,
    updateTeacher,
    deleteTeacher
};
