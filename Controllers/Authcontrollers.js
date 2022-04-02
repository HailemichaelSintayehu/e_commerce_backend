const bcrypt = require('bcryptjs');
const { text } = require('body-parser');
const jwt = require("jsonwebtoken");
const UserModel = require('../Models/UserModel');
const {CLIENT_URL} = process.env
const sendMail = require('./sendMaill')
const useCtrl = {
    register:async(req,res)=>{
        try {
            const {userName,email,password,mobileNumber} = req.body
            if(!userName || !email || !password || !mobileNumber ){
                return res.status(400).json({msg:"please fill all the filelds"})
            }
            if(!validateEmail(email)){
                return res.status(400).json({msg:"Invalid emails"})
            }
            const user = await UserModel.findOne({email})
            if(user){
                return res.status(400).json({msg:"This email already exists."})
            }
            if(password.length < 6){
                return res.status(400).json({msg:"password must be at least 6 characters"})
            }
            //   if(validationMobileNumber(mobileNumber)){
            //     return res.status(400).json({msg:"Invalid Mobile number"})
            // }

            const passwordHash = await bcrypt.hash(password,12)
            
            const newUser = {
                userName,email,mobileNumber,password:passwordHash
            }
           
         
            const activation_token = createActivationToken(newUser)
          
            const url = `${CLIENT_URL}/activate/${activation_token}`

            sendMail(email,url,"Verify your Email Address")

            res.json({msg:"Register Success! Please activate your email to start"}) 
            
        } catch (error) {
            return res.status(500).json({msg:error.message})
            
        }
    },
    activateEmail:async(req,res)=>{
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token,process.env.ACTIVATION_TOKEN_SECRET)
            console.log(user);
            const {userName,email,mobileNumber,password} = user;
            const check = await UserModel.findOne({email})
            if(check){
                return res.status(400).json({msg:"this email is already exists"})
                    
            }
            const newUser = new UserModel({
                userName,email,mobileNumber,password
            })
            await newUser.save();
            res.json({msg:"Acount has been activated"})


          
        } catch (error) {
            return res.status(500).json({msg:error.message})
            
        }
    },
    login:async(req,res)=>{
        try {
             const {email,password} = req.body;
             const user = await UserModel.findOne({email})
             if(!user){
                 return res.status(400).json({msg:"This email does not exist"})
             }
             const isMatch = await bcrypt.compare(password,user.password)
             if(!isMatch){
                 return res.status(400).json({msg:"password is incorrect"})
             }
             console.log(user);
             const refresh_token = createRefreshToken({id:user._id});
             res.cookie('refreshtoken',refresh_token,{
                 httpOnly:true,
                 path:'/refresh_token',
                 maxAge:7*24*60*60*1000 //7days
             })
             res.json({msg:"Login success!"})

        } catch (error) {
            return res.status(500).json({msg:error.message})
            
        }
    },
    getAccessToken:async(req,res)=>{
        try {
            const rf_token = req.cookies.refreshtoken;
            console.log("rf_token:",rf_token);
            if(!rf_token){

                return res.status(400).json({msg:"please login now!"})
            }
            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
                if(error) {
                    return res.status(400).json({msg:"please login now"})
                }
                const access_token = createAccessToken({id:user._id})
                res.json({access_token})
            })
        
        } catch (error) {
            return res.json({msg:error.message})
        }
    },
    forgotPassword:async(req,res)=>{
        try {
            const {email} = req.body;
            const user = await UserModel.findOne({email})
            if(!user) {
                return res.status(400).json({msg:"this email doesn't exist"})

            } 
            const access_token = createAccessToken({id:user._id})
            const url = `${CLIENT_URL}/reset/${access_token}`
            sendMail(email,url,"Reset your password");
            res.json({msg:"Re-send the password,please check you email"})

            
        } catch (error) {
            return res.status(400).json({msg:error.message})
            
        }
    },
    resetPassword:async(req,res)=>{
        try {

            const {password} = req.body;
            console.log("the value of the password:",password);
            const passwordHash = await bcrypt.hash(password,12)
            console.log(req.user);
            await UserModel.findOneAndUpdate({_id:req.user_id},{
                password:passwordHash
            })
            res.json({msg:"password successfully changed"});

            
        } catch (error) {

            return res.status(500).json({msg:error.message})
              
        }
    },
    getUserInfo:async(req,res)=>{
        try {
            const user = await UserModel.findById(req.user.id).select('-password')
            res.json(user)
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    }
}
function validateEmail(email) {
   
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
    
}
const createActivationToken = (payload) =>{
    return jwt.sign(payload,process.env.ACTIVATION_TOKEN_SECRET,{expiresIn:'1h'})
}

const createAccessToken = (payload) =>{
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'50m'})
}

const createRefreshToken = (payload) =>{
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}

function validationMobileNumber(mobileNumber){
    var phoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneNo.test(mobileNumber)
}

module.exports = useCtrl
























// module.exports.register = (req,res,next) =>{
//     const {userName,email,mobileNumber,password} = req.body;
//     User.findOne({email:email},(err,user)=>{
//         if(user){
//             res.send({message:"user already registered"})
//         }else{
//             const user = new User({
//                 userName,
//                 email,
//                 mobileNumber,
//                 password
//             })
//             user.save(err =>{
//                 if(err){
//                     res.send(err)
//                 }
//                 else{
//                     res.send({message:"successfully registered"})
//                 }
//             })

//         }
//     })
  
// }
// module.exports.login = (req,res,next) =>{
//     const {email,password} = req.body;
//     User.findOne({email:email},(err,user) =>{
//         if(user){
//             if(password ===user.password){
//                 res.send({message:"Logged in successfull",user:user})
//             }
//             else{
//                 res.send({message:"password didn't match"})
//             }

//         }
//         else{
//             res.send({message:"user not registered"});
//         }
//     })
// }





// const jwt = require('jsonwebtoken')

// const maxAge = 2*24*60*60;

// const createToken = (id) =>{
//     return jwt.sign({id},"takeme1n",{
//         expiresIn:maxAge
//     })
// }
// const handleErrors  = (err)=>{
//     let errors = {userName:"",email:"",mobileNumber:"",password:""}
//     if(err.message === "Incorrect email"){
//         errors.email = "That email is not registered"
//     }
//     if(err.message ==="Incorrect Password"){
//         errors.password = "That password is incorrect";
//     }
//     if(err.code===11000){
//         errors.email ="Email is already registered";
//     }
//     if(err.message.includes("Users Validation failed")){
//         Object.values(err.errors).forEach(({properties})=>{
//             errors[properties.path] = properties.message
//         })
//     }
//     return errors;
// }
// module.exports.register = async(req,res,next) =>{
//     try{
//         const {userName,email,mobileNumber,password} = req.body;

//         const user = await userModel.create({userName,email,mobileNumber,password});

//         const token = createToken(user._id);

//         res.cookie("jwt",token,{
//             withCredentials:true,
//             httpOnly:false,
//             maxAge:maxAge*1000
//         })

//         res.status(201).json({use:user._id,created:true})

        
//     }
//     catch(error){
//         console.log(error);
//         const errors = handleErrors(error);
//         res.json({errors,created:false})
//     }

// }
// module.exports.login = async(req,res,next) =>{
//     try{
//         const {userName,email,mobileNumber,password} = req.body;

//         const user = await userModel.login({userName,email,mobileNumber,password});

//         const token = createToken(user._id);

//         res.cookie("jwt",token,{
//             withCredentials:true,
//             httpOnly:false,
//             maxAge:maxAge*1000
//         })

//         res.status(200).json({use:user._id,created:true})

        
//     }
//     catch(error){
//         console.log(error);
//         const errors = handleErrors(error);
//         res.json({errors,created:false})
//     }

// }

   