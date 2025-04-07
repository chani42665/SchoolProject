const bcrypt = require("bcrypt");
const Teacher = require("../Models/TeacherModel");
const Student = require("../Models/StudentModel");
const { createToken } = require("../Middlewares/auth");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        let user = await Teacher.findOne({ email }); // בדיקה אם המשתמש מורה
        let role = "";

        if (user) {
            role = user.isAdmain ? "admin" : "teacher"; // אם זה מורה, בדיקה אם הוא גם אדמין
        } else {
            user = await Student.findOne({ email }); // אם לא נמצא כמורה, חפש כתלמיד
            if (user) {
                role = "student";
            }
        }

        if (!user)
            res.status(404).json({ error: "User not found" });

        // בדיקת סיסמה
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
            res.status(401).json({ error: "Invalid credentials" });

        // יצירת טוקן עם תפקיד מתאים
        req.body.role = role;
        createToken(req, res, () => {
            res.status(200).json({ token: req.token, role, message: "Login successful" });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { login };
