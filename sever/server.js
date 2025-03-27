const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const mongoose=require("mongoose")

dotenv.config()

app.use(bodyParser.json())



app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})



