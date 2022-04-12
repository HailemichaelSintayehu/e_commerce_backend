const productModel = require("../Models/productsModel")

const productCtrl = {
    getProducts:async(req,res)=>{
        try {
            const products = await productModel.find()
            res.json({products});
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    createProducts:async(req,res)=>{
        try {
            const {product_id,title,price,description,content,images,category} = req.body;
            if(!images){
                return res.status(400).json({msg:"No image is uploaded"})
            }
            const product = await productModel.findOne({product_id})
            if(product){
                return res.status(400).json({msg:"this product already exists"})
            }
            const newProduct = new productModel({
                product_id,
                title:title.toLowerCase(),
                price,
                description,
                content,
                images,
                category,
    
            })
            await newProduct.save()
                res.json({msg:"created a product"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    deleteProducts:async(req,res)=>{
        try {
            const id = req.params.id;
            console.log(id)
            await productModel.findByIdAndDelete(id)
            res.json({msg:"product deleted"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    updateProducts:async(req,res)=>{
        try {
            const {title,price,description,content,images,category} = req.body;
            if(!images){
                return res.status(400).json({msg:"No image upload"})
            }
            await productModel.findByIdAndUpdate({_id:req.params.id},{
                title,price,description,content,images,category
            })
            res.json({msg:"product updated"})
            
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },

}

module.exports = productCtrl;

