const express = require('express');
require('dotenv').config()
const cors= require('cors')
const mongoose = require('mongoose');
const authRoutes = require('./Routes/Authroute')
const adminRoutes = require("./Routes/categoryRouter")
const uploadRoutes = require("./Routes/upload")
const productRoutes = require("./Routes/productRouter")
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

app.use(fileUpload({
    useTempFiles:true
}))
app.use(
    cors({
    origin: "*",
    method:"*",
    credentials: true
}))
app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.json())

app.use('/',authRoutes);

app.use('/admin',adminRoutes)

app.use("/api",uploadRoutes)

app.use("/checkproducts",productRoutes)

const URI = process.env.MONGODB_URL

mongoose.connect(URI,{
    useNewUrlparser:true,
    useUnifiedTopology:false
    // useCreateIndex:true,
    // useFindAndModify:false

})
.then(()=>{
    console.log("Database connection successfull")

}).catch((err)=>{
    console.log(err);
})
  
app.listen(4000,(req,res)=>{
    console.log("server 4000 is running...")
})