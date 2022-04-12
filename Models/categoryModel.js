const mongoose = require('mongoose')


const categorySchema =new mongoose.Schema({
     userName:{
         type:String,
         required:true,
         trim:true,
         unique:true
     }
},{
    timestamps:true
})

module.exports = mongoose.model("Category",categorySchema)