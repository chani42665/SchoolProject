const Grade = require('../Models/GradeModel')
const Student = require('../Models/StudentModel')
const Exam = require('../Models/ExamModel')
const mongoose = require('mongoose')

async function createGrade(req, res) {
    try {
        const { studentId, examId, grade } = req.body

        const student = await Student.findById(studentId)
        if (!student)
            return res.status(404).json({ error: "Student not found" })
        if(!examId)
            return res.status(404).json({ error: "Exam not found" })

        const newGrade = new Grade(req.body)
        await newGrade.save()

        res.status(200).json(newGrade)
    } catch (error) {
        res.status(500).json(error)
    }
}


async function getAllGrades(req, res) {
    try {
        const grades = await Grade.find().populate('studentId').populate('examId').populate({
            path: 'examId',
            populate: {
                path: 'subject',
                model: 'Subject',
            }
        });
        res.status(200).json(grades)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// async function getGradeById(req, res) {
//     try {
//         const { gradeId } = req.params

//         const grade = await Grade.findById(gradeId)
//             .populate("exam", "subject examDate") // טוען פרטי המבחן (מקצוע + תאריך)
//             .populate("studentID", "firstName lastName email") // טוען פרטי התלמיד

//         if (!grade)
//             return res.status(404).json({ error: "Grade not found" })

//         res.status(200).json(grade)

//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// }

async function getGradesByStudentId(req, res) {
    try {
        const { studentId } = req.params;
        const grades = await Grade.find({ studentId }).populate('examId').populate({
            path: 'examId',
            populate: {
                path: 'subject',
                model: 'Subject',
            }
        });
        res.status(200).json(grades)
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
async function deleteGrade(req, res) {
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


async function updateGrade(req, res) {
    try {
        const { gradeId } = req.params;

        const updatedGrade = await Grade.findByIdAndUpdate(gradeId, req.body,{ new: true });

        if (!updatedGrade)
            return res.status(404).json({message:"Grade not found"})

        res.status(200).json({message:"Grade updated successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function uploadGradesFromExcel(req, res){
    try {
      const { examId } = req.params;
      const { grades } = req.body;
  
      for (const g of grades) {
        const student = await Student.findOne({ studentId: g.studentId })
        if (student) {
          await Grade.findOneAndUpdate(
            { studentId: student._id, examId },
            { grade: g.grade },
            { upsert: true, new: true }
          );
        }
      }
  
      res.status(200).json({ message: 'הציונים עודכנו בהצלחה' })
    } catch (error) {
      console.error('Error uploading grades:', error);
      res.status(500).json({ message: 'שגיאה בעדכון ציונים' })
    }
  };
  const getGradesByExamAndClass = async (req, res) => {
    try {
      const { examId } = req.params
  
      const grades = await Grade.find({ examId }).populate('studentId').populate('examId')
  
      res.status(200).json(grades)
    } catch (error) {
      console.error('Error fetching grades:', error)
      res.status(500).json({ message: 'שגיאה בקבלת ציונים' })
    }
  };
  const getAverageGradeBySubjectOfYear = async (req, res) => {
    try {
      const { subjectId, classId, teacherId, year } = req.query
      const startDate = new Date(year, 0, 1)
      const endDate = new Date(year + 1, 0, 1)
  
      const exams = await Exam.find({
        subject: new mongoose.Types.ObjectId(subjectId),
        classId: new mongoose.Types.ObjectId(classId),
        teacherId:new mongoose.Types.ObjectId(teacherId),
        examDate: { $gte: startDate, $lt: endDate }
      });
  
      if (exams.length === 0) {
        return res.json([])
      }
  
      const examIds = exams.map(exam => exam._id)
  
      const gradesAggregation = await Grade.aggregate([
        { $match: { examId: { $in: examIds } } },
        {
          $group: {
            _id: '$examId',
            averageGrade: { $avg: '$grade' },
          },
        },
      ]);
  
      const results = exams.map(exam => {
        const gradeObj = gradesAggregation.find(g => g._id.equals(exam._id))
        return {
          examId: exam._id,
          examDate: exam.examDate,
          averageGrade: gradeObj ? gradeObj.averageGrade : null,
        };
      });
  
      results.sort((a, b) => a.examDate - b.examDate)
  
      res.json(results)
  
    } catch (error) {
      res.status(500).json({ error: 'Error fetching average grades: ' + error.message });
    }
  };
  
  
module.exports = { createGrade, getAllGrades, 
    // getGradeById, 
    getGradesByStudentId, deleteGrade, updateGrade ,uploadGradesFromExcel,getGradesByExamAndClass,getAverageGradeBySubjectOfYear}