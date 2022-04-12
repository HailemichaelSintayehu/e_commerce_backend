const Users = require('../Models/UserModel')


const authAdmin = async(req,res,next)=>{
    try {
        const user = await Users.findOne({_id:req.user.id})
        if(user.role ===0){
            return res.status(500).json({msg:"Admin resources access denied"})
        }

        next()
    } catch (error) {

        res.status(500).json({msg:error.message})
        
    }
}

module.exports = authAdmin;