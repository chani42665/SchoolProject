const Class = require('../Models/ClassModel');
const Student = require('../Models/StudentModel');
const Teacher = require('../Models/TeacherModel');

const {createStudent} = require("./StudentController")

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

async function getClassById(req , res) {
    try {
        const { classId } = req.params;
        const classObj = await Class.findById(classId).populate('students').populate('teachers');
        if (!classObj) return res.status(404).json({ error: "Class not found" });
        res.status(200).json(classObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getClassByStudentId(req,res) {
    try {
        const { studentId } = req.params;
        const classObj = await Class.findOne({ students: studentId }).populate('students').populate('teachers');
        if (!classObj) return res.status(404).json({ error: "Class not found" });
        res.status(200).json(classObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// קבלת כל הכיתות
async function getAllClasses(req, res) {
    try {
        const classes = await Class.find()
        //.populate('students').populate('teachers');
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// הוספת תלמיד לכיתה
// async function addStudentToClass(req, res) {
//     try {
//         const { studentId } = req.params;
//         const student = await Student.findById(studentId);
//         if (!student) {
//             return res.status(404).json({ error: "Student not found" });
//         }

//         const classId = student.classId;
//         if (!classId) {
//             return res.status(400).json({ error: "Student is not assigned to any class" });
//         }
//         const classObj = await Class.findById(classId);
//         if (!classObj) 
//             return res.status(404).json({ error: "Class not found" });


//         //await Student.findByIdAndUpdate(studentId, { classId });
//         classObj.students.push(studentId);
//         await classObj.save();
//         res.status(200).json({ message: "Student added to class" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// // הוספת מורה לכיתה
// async function addTeacherToClass(req, res) {
//     try {
//         const { classId, teacherId } = req.body;
//         const classObj = await Class.findById(classId);
//         if (!classObj) 
//             return res.status(404).json({ error: "Class not found" });
//         const teacher = await Teacher.findById(teacherId);
//         if (!teacher) 
//             return res.status(404).json({ error: "Teacher not found" });

//         await Teacher.findByIdAndUpdate(teacherId, { $push: { classes: classId } });
//         classObj.teachers.push(teacherId);
//         await classObj.save();
//         res.status(200).json({ message: "Teacher added to class" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
        
//     }
// }

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

async function getClassesByTeacher (req, res) {
    try {
      const { teacherId } = req.params;
      const classes = await Class.find({ teachers: teacherId }).populate('students');
      res.json(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'שגיאה בקבלת כיתות' });
    }
  };

  // לדוגמה ב-class.routes.js
    async function addStudentsFromExcel(req, res) {
     const { classId } = req.params;
    const { students } = req.body;

    try {
        for (let studentData of students) {
            // מוסיפים classId ידנית אם לא קיים
            if (!studentData.classId) {
                studentData.classId = classId;
            }

            // מוודאים שיש studentId
            if (!studentData.studentId) {
                continue; // או את יכולה לזרוק שגיאה
            }

            // יוצרים בקשה מזויפת כדי לקרוא ל-createStudent כאילו זה route רגיל
            const fakeReq = { body: studentData };
            const fakeRes = {
                status: () => ({ json: () => {} }),
                json: () => {},
            };

            await createStudent(fakeReq, fakeRes);
        }

        res.send("כל התלמידות מהקובץ נוספו בהצלחה");
    } catch (err) {
        console.error(err);
        res.status(500).send("שגיאה בעת יצירת תלמידים מהקובץ");
    }
}

// הסרת תלמיד מכיתה
// async function removeStudentFromClass(req, res) {
//     try {
//         const { studentId } = req.params;

//         const student = await Student.findById(studentId);
//         if (!student) {
//             return res.status(404).json({ error: "Student not found" });
//         }

//         const classId = student.classId;
//         if (!classId) {
//             return res.status(400).json({ error: "Student is not assigned to any class" });
//         }

//         const classObj = await Class.findById(classId);
//         if (!classObj) {
//             return res.status(404).json({ error: "Class not found" });
//         }

//         // הסרת מזהה התלמיד מרשימת התלמידים בכיתה
//         classObj.students = classObj.students.filter(
//             (_id) => _id.toString() !== studentId
//         );
//         await classObj.save();

//         // הסרת שיוך הכיתה מהתלמיד
//         // await Student.findByIdAndUpdate(studentId, { $unset: { classId: "" } });

//         res.status(200).json({ message: "Student removed from class" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }


// הסרת מורה מכיתה
// async function removeTeacherFromClass(req, res) {
//     try {
//         const { classId, teacherId } = req.body;
//         const classObj = await Class.findById(classId);
//         if (!classObj) return res.status(404).json({ error: "Class not found" });

//         await Teacher.findByIdAndUpdate(teacherId, { $pull: { classes: classId } });
//         classObj.teachers = classObj.teachers.filter(id => id.toString() !== teacherId);
//         await classObj.save();
//         res.status(200).json({ message: "Teacher removed from class" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

module.exports = {
    createClass,
    getAllClasses,
    getClassById,
    getClassByStudentId,
    // addStudentToClass,
    // addTeacherToClass,
    updateClass,
    // removeStudentFromClass,
    // removeTeacherFromClass
    getClassesByTeacher,
    addStudentsFromExcel
}
