const bcrypt = require("bcrypt");
const Teacher = require("../Models/TeacherModel");
const Student = require("../Models/StudentModel");
const { createToken } = require("../Middlewares/auth");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        let user = await Teacher.findOne({ email }); // בדיקה אם המשתמש מורה
        if (!user) {
            user = await Student.findOne({ email });
        } 

        if (!user)
            return res.status(404).json({ error: "User not found" });
        // בדיקת סיסמה
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
            return res.status(401).json({ error: "Invalid credentials" });

        // יצירת טוקן עם תפקיד מתאים
        req.body.role = user.role;
        createToken(req, res, () => {
            const { password, ...userWithoutPassword } = user.toObject();

            res.status(200).json({
                user: userWithoutPassword, 
                token: req.token,
                message: "Login successful"
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { login };
