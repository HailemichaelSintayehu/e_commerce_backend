const categoryModel = require("../Models/categoryModel")

require("body-parser")

const categoryCtrl = {
    getCategories:async(req,res) =>{
       try {
           const categories = await categoryModel.find()
           res.status(200).json(categories)

           
       } catch (error) {
           res.status(500).json({"msg":error.message})
       }
    },
    createCategory:async(req,res)=>{
        try {
            const {userName} = req.body;
            const category = await categoryModel.findOne({userName})
            if(category){
                return res.status(400).json({msg:"This category already exists."})
            }
            const newCategory = new categoryModel({userName})

            await newCategory.save()

            res.json({msg:"Created a category"})
        } catch (error) {
            return res.status(500).jsyon({"msg":error.message})
        }
    },
    deleteCategory:async(req,res)=>{
        try {
            const id = req.params.id;
            console.log(id);
            await categoryModel.findByIdAndDelete(id)
            res.json("deleted a Category")
            

        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    updateCategory:async(req,res)=>{
        try {
            const {userName} = req.body;
            const id = req.params.id;
            console.log(id);
            await categoryModel.findOneAndUpdate({_id:id},{userName});
       
            res.json("updated a category");
        } catch (error) {
            return res.state(500).json({msg:error.message})
            
        }
    }
}
module.exports = categoryCtrl 