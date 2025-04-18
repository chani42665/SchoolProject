const Class = require('../Models/ClassModel');
const Student = require('../Models/StudentModel');
const Teacher = require('../Models/TeacherModel');

async function createClass(req, res) {
    try {
        const { studentIds, teacherIds, ...classData } = req.body;
        const newClass = new Class(classData);
        await newClass.save();

        if (studentIds?.length) {
            await Student.updateMany({ _id: { $in: studentIds } }, { classId: newClass._id });
            newClass.students.push(...studentIds);
        }

        if (teacherIds?.length) {
            await Teacher.updateMany({ _id: { $in: teacherIds } }, { $push: { classes: newClass._id } });
            newClass.teachers.push(...teacherIds);
        }

        await newClass.save();
        res.status(200).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// קבלת כל הכיתות
async function getAllClasses(req, res) {
    try {
        const classes = await Class.find().populate('students').populate('teachers');
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// הוספת תלמיד לכיתה
async function addStudentToClass(req, res) {
    try {
        const { classId, studentId } = req.body;
        const classObj = await Class.findById(classId);
        if (!classObj) 
            return res.status(404).json({ error: "Class not found" });
        const student = await Student.findById(studentId);
        if (!student) return 
            res.status(404).json({ error: "Student not found" });

        await Student.findByIdAndUpdate(studentId, { classId });
        classObj.students.push(studentId);
        await classObj.save();
        res.status(200).json({ message: "Student added to class" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// הוספת מורה לכיתה
async function addTeacherToClass(req, res) {
    try {
        const { classId, teacherId } = req.body;
        const classObj = await Class.findById(classId);
        if (!classObj) 
            return res.status(404).json({ error: "Class not found" });
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) 
            return res.status(404).json({ error: "Teacher not found" });

        await Teacher.findByIdAndUpdate(teacherId, { $push: { classes: classId } });
        classObj.teachers.push(teacherId);
        await classObj.save();
        res.status(200).json({ message: "Teacher added to class" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}

// עדכון פרטי כיתה
async function updateClass(req, res) {
    try {
        const { classId } = req.params;
        const updateData = req.body;
        const updatedClass = await Class.findByIdAndUpdate(classId, updateData, { new: true });
        if (!updatedClass) 
            return res.status(404).json({ error: "Class not found" });
        res.status(200).json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// הסרת תלמיד מכיתה
async function removeStudentFromClass(req, res) {
    try {
        const { classId, studentId } = req.body;
        const classObj = await Class.findById(classId);
        if (!classObj) return 
            res.status(404).json({ error: "Class not found" });
        const student = await Student.findById(studentId);
        if (!student) 
            return res.status(404).json({ error: "Student not found" });
        await Student.findByIdAndUpdate(studentId, { $unset: { classId: "" } });
        classObj.students = classObj.students.filter(id => id.toString() !== studentId);
        await classObj.save();
        res.status(200).json({ message: "Student removed from class" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// הסרת מורה מכיתה
async function removeTeacherFromClass(req, res) {
    try {
        const { classId, teacherId } = req.body;
        const classObj = await Class.findById(classId);
        if (!classObj) return res.status(404).json({ error: "Class not found" });

        await Teacher.findByIdAndUpdate(teacherId, { $pull: { classes: classId } });
        classObj.teachers = classObj.teachers.filter(id => id.toString() !== teacherId);
        await classObj.save();
        res.status(200).json({ message: "Teacher removed from class" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createClass,
    getAllClasses,
    addStudentToClass,
    addTeacherToClass,
    updateClass,
    removeStudentFromClass,
    removeTeacherFromClass
}
