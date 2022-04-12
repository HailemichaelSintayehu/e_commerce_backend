// const fs = require('fs')

// module.exports = async(req,res,next)=>{
//     try {
//         if(!req.files || Object.keys(req.files).length ===0){
//             return res.status(400).json({msg:"No files were uploaded"})
           
//         }
//         const file = req.files.file;
//         if(file.size > 1024*1024){
//             removeTmp(file)
//         }
//     } catch (error) {
//         return res.status(500).json({msg:error.message})
//     }
// }