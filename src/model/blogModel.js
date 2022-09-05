const mongoose=require('mongoose')
const objectid=mongoose.Schema.Types.ObjectId

const blogScehma=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
       tyep:objectId,
       ref:mongoose.Schema.Types.ObjectI
    }
})