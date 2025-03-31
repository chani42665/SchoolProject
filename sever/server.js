const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cors = require("cors")
const mongoose=require("mongoose")
const classRouter = require("./Routers/ClassRouter")
const studentRouter = require("./Routers/StudentRouter")
const teacherRouter = require("./Routers/TeacherRouter")
const examRouter = require("./Routers/ExamRouter")
const gradeRouter = require("./Routers/GradeRouter")

dotenv.config()

app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_CONNECT)
.then(()=>console.log("connect")).catch(err => console.error("connection failed…"))

app.use("/class",classRouter)
app.use("/student",studentRouter)
app.use("/teacher",teacherRouter)
app.use("/exam",examRouter)
app.use("/grade",gradeRouter)

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})



