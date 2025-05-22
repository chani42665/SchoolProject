const Exam = require('../Models/ExamModel');
const Student = require('../Models/StudentModel');
const Teacher = require('../Models/TeacherModel')
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');


async function createExam(req, res) {
    try {
        const newExam = new Exam(req.body);
        await newExam.save();
        const { teacherId } = req.body;
       await Teacher.findByIdAndUpdate(teacherId, { $push: { exams: newExam } });
        res.status(200).json({ message: "Exam created successfully", exam: newExam });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// קבלת כל המבחנים
async function getAllExams(req, res) {
    try {
        const exams = await Exam.find().populate('classId').populate('subject');
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getExamByClassId(req, res) {
    try {
        const { classId } = req.params;

        // שליפת כל המבחנים של הכיתה המבוקשת
        const exams = await Exam.find({ classId }).populate('subject').populate('teacherId');

        if (!exams || exams.length === 0) {
            return res.status(404).json({ error: "No exams found for this class" });
        }

        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getExamById=async (req, res) => {
    try {
        const { examId } = req.params;
        const exam = await Exam.findById(examId).populate('classId').populate('teacherId').populate('subject');

        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateExam(req, res) {
    try {
        const { examId } = req.params;
        const updatedExam = await Exam.findByIdAndUpdate(examId, req.body, { new: true });

        if (!updatedExam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        res.status(200).json({ message: "Exam updated successfully", exam: updatedExam });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// מחיקת מבחן
async function deleteExam(req, res) {
    try {
        const { examId } = req.params;
        const exam = await Exam.findById(examId);
        await Teacher.findByIdAndUpdate(exam.teacherId, { $pull: { exams: examId } });
        const deletedExam = await Exam.findByIdAndDelete(examId);

        if (!deletedExam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function getExamsByClassAndTeacher(req, res) {
    try {
      const { classId, teacherId } = req.params;
      const exams = await Exam.find({
        classId,
        teacherId,
      }).populate('subject');
  
      res.json(exams);
    } catch (error) {
      console.error('Error fetching exams:', error);
      res.status(500).json({ message: 'שגיאה בקבלת מבחנים' });
    }
  };


  async function getExamsBySubjectAndClass(req, res) {
    try {
      const { subjectId, classId, teacherId } = req.query
  
      // בדיקת תקינות מזהים
      if (
        !mongoose.Types.ObjectId.isValid(subjectId) ||
        !mongoose.Types.ObjectId.isValid(classId) ||
        !mongoose.Types.ObjectId.isValid(teacherId)
      ) {
        return res.status(400).json({ message: 'אחד או יותר מה־IDים אינו תקין' });
      }
  
      // שליפת מבחנים מהמסד
      const exams = await Exam.find({
        subject: new mongoose.Types.ObjectId(subjectId),
        classId: new mongoose.Types.ObjectId(classId),
        teacherId: new mongoose.Types.ObjectId(teacherId),  
      });
  
      res.json(exams);
    } catch (error) {
      console.error('Error fetching exams by subject and class:', error);
      res.status(500).json({ message: 'שגיאה בקבלת מבחנים לפי מקצוע וכיתה' });
    }
  }
  
  
  
  const getAvrageExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const exam = await Exam.findById(examId).populate('classId').populate('subject');
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }
        const students = await Student.find({ classId: exam.classId });
        const totalScore = students.reduce((acc, student) => acc + student.score, 0);
        const averageScore = totalScore / students.length;
        res.status(200).json({ averageScore });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// async function sendExamReminder(req, res) {
//     try {
//         const { examId } = req.body;

//         const exam = await Exam.findById(examId).populate('class');
//         if (!exam)
//             return res.status(404).json({ error: "Exam not found" });

//         const classObj = await Class.findById(exam.class._id).populate('students');
//         if (!classObj)
//             return res.status(404).json({ error: "Class not found" });

//         const students = await Student.find({ _id: { $in: classObj.students } });

//         if (students.length === 0) {
//             return res.status(400).json({ error: "No students found in this class" });
//         }

//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
//         });

//         const emailPromises = students.map(student => {
//             const mailOptions = {
//                 from: process.env.EMAIL,
//                 to: student.email,
//                 subject: `Reminder: Upcoming Exam - ${exam.subject}`,
//                 text: `Dear ${student.name},\n\nYou have an exam on ${exam.examDate}. Please be prepared!\n\nBest regards,\nSchool Management`
//             };
//             return transporter.sendMail(mailOptions);
//         });

//         await Promise.all(emailPromises);

//         res.status(200).json({ message: "Reminders sent successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


module.exports = { createExam, getAllExams, getExamByClassId, updateExam, deleteExam
    // , sendExamReminder
    ,getExamById,getExamsByClassAndTeacher,getExamsBySubjectAndClass ,getAvrageExam};