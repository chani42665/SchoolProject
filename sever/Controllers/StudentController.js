const Student = require('../Models/StudentModel');
const Class = require('../Models/ClassModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

// יצירת תלמיד חדש
async function createStudent(req, res) {
    console.log("body:", req.body);
console.log("classId:", req.body.classId);
console.log("studentId:", req.body.studentId);
console.log("email:", req.body.email);

    try {

        const newStudent = new Student(
            req.body,
            // password: hashedPassword
        );

        if(!newStudent.password)
            newStudent.password = newStudent.studentId
        if (!newStudent.role) {
            newStudent.role = 'student'; // ברירת מחדל ל-role
        }
        const hashedPassword = await bcrypt.hash(newStudent.password, 10);
        newStudent.password =hashedPassword
        await newStudent.save();

        const { classId } = req.body;
        let classObj = await Class.findById(classId);
        if (!classObj) {
            return res.status(404).json({ error: "Class not found" });
        }
        //  await sendEmail(newStudent.email, "Welcome to the class", `Hello ${newStudent.firstName},\n\nYou have been added to the class ${classObj.name}.\n\nBest regards,\nSchool Team`);
        // הוספת התלמיד לרשימת התלמידים בכיתה
        await Class.findByIdAndUpdate(newStudent.classId, { $push: { students: newStudent._id } });
        sendEmail(newStudent.email, "Welcome to the class", `Hello ${newStudent.firstName},\n\nYou have been added to the class ${classObj.name}.\n\nBest regards,\nSchool Team`);
        res.status(200).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        console.error("Create student failed:", error);
        res.status(400).json({ error: error.message });
    }
    
}
const sendEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email: ", error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

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
        const { id } = req.params;
       //await CalssController.removeStudentFromClass(req,res)
      await removeStudentFromClass(id)
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
        req.body = updatedStudent

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }
        await addStudentToClass(updatedStudent._id)
       //await CalssController.addStudentToClass(req,res)
        
        res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function removeStudentFromClass(id) {
    try {
        //const { studentId } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return 
            //res.status(404).json({ error: "Student not found" });
        }

        const classId = student.classId;
        if (!classId) {
            return 
            //res.status(400).json({ error: "Student is not assigned to any class" });
        }

        const classObj = await Class.findById(classId);
        if (!classObj) {
            return 
            //res.status(404).json({ error: "Class not found" });
        }

        // הסרת מזהה התלמיד מרשימת התלמידים בכיתה
        classObj.students = classObj.students.filter(
            (_id) => _id.toString() !== id
        );
        await classObj.save();

        // הסרת שיוך הכיתה מהתלמיד
        // await Student.findByIdAndUpdate(studentId, { $unset: { classId: "" } });

        //res.status(200).json({ message: "Student removed from class" });
    } catch (error) {
        //res.status(500).json({ message: error.message });
    }
}
async function addStudentToClass(studentId) {
    try {
        //const { studentId } = req.params;
        const student = await Student.findById(studentId);
        if (!student) {
            return 
            //res.status(404).json({ error: "Student not found" });
        }

        const classId = student.classId;
        if (!classId) {
            return 
            //res.status(400).json({ error: "Student is not assigned to any class" });
        }
        const classObj = await Class.findById(classId);
        if (!classObj) 
            return 
        //res.status(404).json({ error: "Class not found" });


        //await Student.findByIdAndUpdate(studentId, { classId });
        classObj.students.push(studentId);
        await classObj.save();
        //res.status(200).json({ message: "Student added to class" });
    } catch (error) {
        //res.status(500).json({ message: error.message });
    }
}



// async function updateStudent(req, res) {
//     try {
//         const { id } = req.params;

//         // Validate the ObjectId
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: "Invalid student ID format" });
//         }

//         const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });

//         if (!updatedStudent) {
//             return res.status(404).json({ error: "Student not found" });
//         }

//         res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }
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
