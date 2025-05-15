const mongoose=require('mongoose')
const subjectModel=new mongoose.Schema({
    name:{type:String,required:true,unique:true}
})
module.exports=mongoose.model('Subject',subjectModel)