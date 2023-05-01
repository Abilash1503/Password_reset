const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://abi:abi@cluster0.th5vzm3.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mail:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }
})

const userDetails=new mongoose.model('userDetails',logInSchema)

module.exports=userDetails
