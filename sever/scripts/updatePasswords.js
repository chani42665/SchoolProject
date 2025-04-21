const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Teacher = require("../Models/TeacherModel");
const Student = require("../Models/StudentModel");
require("dotenv").config();

async function updatePasswords() {
    try {
        // התחברות ל-MongoDB
        await mongoose.connect(process.env.MONGODB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        // עדכון סיסמאות למורים
        const teachers = await Teacher.find();
        for (const teacher of teachers) {
            if (!teacher.password.startsWith("$2b$")) { // בדיקה אם הסיסמה כבר מוצפנת
                teacher.password = await bcrypt.hash(teacher.password, 10);
                await teacher.save();
                console.log(`Updated password for teacher: ${teacher.email}`);
            }
        }

        // עדכון סיסמאות לתלמידים
        const students = await Student.find();
        for (const student of students) {
            if (!student.password.startsWith("$2b$")) { // בדיקה אם הסיסמה כבר מוצפנת
                student.password = await bcrypt.hash(student.password, 10);
                await student.save();
                console.log(`Updated password for student: ${student.email}`);
            }
        }

        console.log("Password update completed successfully");
        mongoose.connection.close(); // סגירת החיבור ל-MongoDB
    } catch (error) {
        console.error("Error updating passwords:", error.message);
        mongoose.connection.close(); // סגירת החיבור ל-MongoDB במקרה של שגיאה
    }
}

updatePasswords();