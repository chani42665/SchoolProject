const Student = require('../Models/StudentModel');
const Class = require('../Models/ClassModel');

// יצירת תלמיד חדש
async function createStudent(req, res) {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        const { classId } = req.body;
        let classObj = await Class.findById(classId);
        if(!classObj)
            return res.status(404).json({ error: "Class not found" });
        
        // הוספת התלמיד לרשימת התלמידים בכיתה
        await Class.findByIdAndUpdate(newStudent.classId, { $push: { students: newStudent._id } });

        res.status(200).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// שליפת כל התלמידים
async function getAllStudents(req, res) {
    try {
        const students = await Student.find().populate('classId', 'name'); // שליפת מידע על הכיתה
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// שליפת תלמיד לפי ID
async function getStudentById(req, res) {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId).populate('classId', 'name');

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// שליפת תלמידים לפי כיתה
async function getStudentsByClassId(req, res) {
    try {
        const { classId } = req.params
        const students = await Student.find({ classId })


        if (students.length === 0) {
            return res.status(404).json({ error: "No students found in this class" });
        }

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// עדכון תלמיד
async function updateStudent(req, res) {
    try {
        const { studentId } = req.params;
        const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// מחיקת תלמיד
async function deleteStudent(req, res) {
    try {
        const { studentId } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(studentId);

        if (!deletedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        // הסרת התלמיד מהרשימה בכיתה
        await Class.findByIdAndUpdate(deletedStudent.classId, { $pull: { students: studentId } });

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentsByClassId,
    updateStudent,
    deleteStudent
};
