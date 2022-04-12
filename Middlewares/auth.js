const jwt = require("jsonwebtoken")


const auth = (req,res,next)=>{
    try {
      const token = req.headers.authorization
      if(!token){
          return res.status(400).json({msg:"Invalid Authentication"})

      }  
      jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,user)=>{
          if(error){
              return res.status(400).json({msg:"Invalid Authentication."})
          }
          req.user = user;
           next()
      })
    //   if(req.cookie.access_token === access_token_db && access_token_time_db>Date.now()){
    //       return true
    //   }else if(access_token_time_db<Date.now()){
    //       if(req.cookie.refresh_token === refresh_token_db){
    //           res.cookie=setCookie
    //           return res
    //       }
    //   }
    //   return res.status(304).json({msg: "access_denied"})

    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}
module.exports= auth

// function setCookie(res){
//     res.cookie('refreshtoken',refresh_token,{
//         httpOnly:true,
//         path:'/refresh_token',
//         maxAge:7*24*60*60*1000 //7days
//     })
//     return res.cookie
// }
// const checkRefershToken = async (req, res, next)=>{
    
// }