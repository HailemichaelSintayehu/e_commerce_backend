const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({

    userName:{
        type:String,
        required:[true,"userName is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Your email is required"],
        trim:true,
        unique:true
    },
    mobileNumber:{
        type:Number,
        required:[true,"Mobile Number is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    role:{
        type:Number,
        default:0
    },
    cart:{
        type:Array,
        default:[]
    },
    date:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})


module.exports = mongoose.model('Users',userSchema)