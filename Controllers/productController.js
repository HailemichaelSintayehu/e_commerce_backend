const productModel = require("../Models/productsModel")

class APIfeatures {
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString}

        const excludeFields = ['page','sort','limit']

        excludeFields.forEach(el => delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj)

        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,(match) =>'$' + match)

        this.query.find(JSON.parse(queryStr))
        
        return this;
    }   
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy);
            this.query = this.query.sort(sortBy)
        }
        else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit  * 1 || 9
        const skip = (page - 1)*limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;

        

    }
}


const productCtrl = {
    getProducts:async(req,res)=>{
        try {
            // console.log(req.query);
            const features = new APIfeatures(productModel.find(),req.query).filtering().sorting().paginating();

            const products = await features.query
            
            res.json({
                status:"success",
                result:products.length,
                products:products
            });
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

