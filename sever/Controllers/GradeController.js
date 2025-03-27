const Grade = require('../Models/GradeModel')
const Student = require('../Models/StudentModel')

async function createGrade(req, res) {
    try {
        const { studentId, exam, grade } = req.body

        const student = await Student.findById(studentId)
        if (!student)
            return res.send("Student not found").status(404)

        const newGrade = new Grade(req.body)
        await newGrade.save()

        student.grades.push(newGrade._id)
        await student.save()

        res.send(newGrade).status(200)
    } catch (error) {
        res.send(error).status(500)
    }
}


async function getAllGrades(req, res) {
    try {
        const grades = await Grade.find().populate('studentId').populate('exam')
        res.send(grades).status(200)
    } catch (error) {
        res.send(error).status(500)
    }
}

async function getGradeById(req, res) {
    try {
        const { gradeId } = req.params

        const grade = await Grade.findById(gradeId)
            .populate("exam", "subject examDate") // טוען פרטי המבחן (מקצוע + תאריך)
            .populate("studentID", "firstName lastName email") // טוען פרטי התלמיד

        if (!grade)
            return res.send("Grade not found").status(404)

        res.send(grade).status(200)

    } catch (error) {
        res.send(error).status(500)
    }
}

async function getGradesByStudentId(req, res) {
    try {
        const { studentId } = req.params;
        const grades = await Grade.find({ studentId }).populate('exam')
        res.send(grades).status(200)
    } catch (error) {
        res.send(error).status(500)

    }
}
async function deleteGradeById(req, res) {
    try {
        const { gradeId } = req.params

        const deletedGrade = await Grade.findByIdAndDelete(gradeId)
        if (!deletedGrade)
            return res.send("Grade not found").status(404)

        res.send("Grade deleted successfully").status(200)
    } catch (error) {
        res.send(error).status(500)
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
            return res.send("Grade not found").status(404)

        res.send("Grade updated successfully" + updatedGrade).status(200)
    } catch (error) {
        res.send(error).status(500)
    }
}


module.exports = { createGrade, getAllGrades, getGradeById, getGradesByStudentId, deleteGradeById, updateGradeById }