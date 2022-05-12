const bcrypt = require("bcryptjs");
require("body-parser");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
const productsModel = require("../Models/productsModel");
const { CLIENT_URL } = process.env;
// const sendMail = require('./sendMaill')
const useCtrl = {
register: async (req, res) => {
    try {
      const { userName, email, password, mobileNumber } = req.body;
      if (!userName || !email || !password || !mobileNumber) {
        return res.status(400).json({ msg: "please fill all the filelds" });
      }
      // if(validateUserName(Uname)){
      //     return res.status(400).json({msg:"Please enter a valid username"})
      // }
      if (!validateEmail(email)) {
        return res.status(400).json({ msg: "Invalid emails" });
      }
      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "This email already exists." });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "password must be at least 6 characters" });
      } 
      if (!mobileNumber) {
        return res.status(400).json({ msg: "please enter your Mobile number" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new UserModel({
        userName,
        email,
        mobileNumber,
        password: passwordHash,
      });
      await newUser.save();
      
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({id:newUser._id})
      // const activation_token = createActivationToken(newUser)

      // const url = `${CLIENT_URL}/activate/${activation_token}`

      // sendMail(email,url,"Verify your Email Address")
      res.cookie('refreshtoken',refreshtoken,{
          httpOnly:true,
          path:'/refresh_token'
      })
 

    //   res.json({ msg: "Register Success!" });
      res.json({ accesstoken, refreshtoken }); 
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  // activateEmail:async(req,res)=>{
      //     try {
          //         const {activation_token} = req.body
          //         const user = jwt.verify(activation_token,process.env.ACTIVATION_TOKEN_SECRET)
  //         console.log(user);
  //         const {userName,email,mobileNumber,password} = user;
  //         const check = await UserModel.findOne({email})
  //         if(check){
  //             return res.status(400).json({msg:"this email is already exists"})
  
  //         }
  //         const newUser = new UserModel({
      //             userName,email,mobileNumber,password
      //         })
      //         await newUser.save();
      //         res.json({msg:"Acount has been activated"})
      
      //     } catch (error) {
  //         return res.status(500).json({msg:error.message})

  //     }
  // },
login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: "This email does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "password is incorrect" });
        }
        
        
        const accesstoken = createAccessToken({ id: user._id });
        const refreshtoken = createRefreshToken({ id: user._id });
        
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            path: "/refresh_token",
        });
        res.json({ accesstoken, refreshtoken });
        //   res.json({ msg: "Login success!" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
},
logout: async (req, res) => {
    try {
        res.clearCookie("refrestoken", { path: "/refresh_token" })
        return res.json({ msg: "logged out " });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
},
refreshToken: async (req, res) => {
  try {
    const rf_token = req.headers.refreshtoken;
    console.log(rf_token);
    if (!rf_token) {
      return res.status(400).json({ msg: "please login now!" });
    }
    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(400).json({ msg: "please login now" });
      }
      const accesstoken = createAccessToken({ id: user.id });
      res.json({user,accesstoken });
    });
  } catch (error) {
    return res.json({ msg: error.message });
  }
},
getUser: async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password ")
    if(!user){
      return res.status(400).json({msg:"User does not exist"})
    }
 
    return res.status(200).json({"user":user});   
     

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
},
addCart:async (req,res) =>{
  try {
    const user = await UserModel.findById(req.user.id);
    if(!user){
      return res.status(400).json({msg:"user does not exist"})
    }
    await UserModel.findByIdAndUpdate({_id:req.user.id},{
      cart:req.body.cart
    })

    return res.json({msg:"Added to cart"})

  } catch (error) {

    return res.status(400).json({msg:""})
    
  }
},
history:async (req,res) =>{
  try {
    const history = await productsModel.find({_id:req.products.id})

    res.json(history)


  } catch (error) {
    res.status(400).json({msg:"Please buy first"})
}
},
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "this email doesn't exist" });
      }
      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/reset/${access_token}`;
      sendMail(email, url, "Reset your password");
      res.json({ msg: "Re-send the password,please check you email" });
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      console.log("the value of the password:", password);
      const passwordHash = await bcrypt.hash(password, 12);
      console.log(req.user);
      await UserModel.findOneAndUpdate(
        { _id: req.user_id },
        {
          password: passwordHash,
        }
      );
      res.json({ msg: "password successfully changed" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUsersAllInfo: async (req, res) => {
    try {
      console.log(req.user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { userName } = req.body;
      await UserModel.findOneAndUpdate(
        { _id: req.user.id },
        {
          userName,
        }
      );
      res.json({ msg: "update success" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.json({ msg: "Delete Success" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
function validateEmail(email) {
  var re = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  return email.match(re);
}
// const createActivationToken = (payload) => {
//   return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
//     expiresIn: "1d",
//   });
// };

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// function validatePhoneNumber(mobileNumber) {
//     var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

//     return re.test(input_str);
//   }

// function validateUserName(Uname){
//     var re = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
//     re.test(Uname);
// }

module.exports = useCtrl;

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
