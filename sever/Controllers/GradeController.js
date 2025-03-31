const Grade = require('../Models/GradeModel')
const Student = require('../Models/StudentModel')

async function createGrade(req, res) {
    try {
        const { studentId, exam, grade } = req.body

        const student = await Student.findById(studentId)
        if (!student)
            return res.status(404).json({ error: "Student not found" })
        if(!exam)
            return res.status(404).json({ error: "Exam not found" })

        const newGrade = new Grade(req.body)
        await newGrade.save()

        student.grades.push(newGrade._id)
        await student.save()

        res.status(200).json(newGrade)
    } catch (error) {
        res.status(500).json(error)
    }
}


async function getAllGrades(req, res) {
    try {
        const grades = await Grade.find().populate('studentId').populate('exam')
        res.status(200).json(grades)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function getGradeById(req, res) {
    try {
        const { gradeId } = req.params

        const grade = await Grade.findById(gradeId)
            .populate("exam", "subject examDate") // טוען פרטי המבחן (מקצוע + תאריך)
            .populate("studentID", "firstName lastName email") // טוען פרטי התלמיד

        if (!grade)
            return res.status(404).json({ error: "Grade not found" })

        res.status(200).json(grade)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function getGradesByStudentId(req, res) {
    try {
        const { studentId } = req.params;
        const grades = await Grade.find({ studentId }).populate('exam')
        res.status(200).json(grades)
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
async function deleteGradeById(req, res) {
    try {
        const { gradeId } = req.params

        const deletedGrade = await Grade.findByIdAndDelete(gradeId)
        if (!deletedGrade)
            return res.status(404).json({message:"Grade not found"})

        res.status(200).json({message:"Grade deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


async function updateGradeById(req, res) {
    try {
        const { gradeId } = req.params;
        const { newGrade } = req.body;

        const updatedGrade = await Grade.findByIdAndUpdate(
            gradeId,
            { grade: newGrade },
            { new: true }
        );

        if (!updatedGrade)
            return res.status(404).json({message:"Grade not found"})

        res.status(200).json({message:"Grade updated successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = { createGrade, getAllGrades, getGradeById, getGradesByStudentId, deleteGradeById, updateGradeById }