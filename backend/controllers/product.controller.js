// import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js"
import {v2 as cloudinary} from 'cloudinary'

export const getAllProducts = async(req,res)=>{
    const products = await Product.find({});
    res.json(products);
}

export const getFeatureProduct = async(req,res)=>{
    try {
          let featuredProducts = await Product.find({isFeatured:true})

        if(featuredProducts){
            return res.status(201).json(featuredProducts)
        }
        console.log(featuredProducts)

        if(!featuredProducts){
            return res.status(404).json({message:"No featured product found"})
        }

        // await redis.set('featured_products',JSON.stringify(featuredProducts));
        res.json(featuredProducts)

    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}
export const createProduct = async (req,res)=>{
    try {
        const {name,description,price,image,category} = req.body;
        let result = null
        if(image){
         result  = await cloudinary.uploader.upload(image,{
                folder:'products',  
            })
        }
        const product = await Product.create({
            name,
            description,
            price,
            image:result?.secure_url? result?.secure_url:'',
            category
        })
        res.json(product)
    } catch (error) {
        console.log('error in createin product',error.message);
        res.status(500).json({message:'Internal server error'})
    }

}
export const deleteProduct = async(req,res)=>{
   try {
     const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({message:'Product not found'})
    }
    if(product.image){
        try {
             const public_id = Product.image.split('/').pop().split('.')[0];
             await cloudinary.uploader.destroy(`products/${public_id}`);
        } catch (error) {
            console.log('error deleting product from cloudinary')
        }
    }
await Product.findByIdAndDelete(id);
res.json({message:'Product deleted successfully'})
   } catch (error) {
    console.log('error in deleting product',error.message);
    res.status(500).json({message:'Internal server error'})
   }

}
export const getRecommendedProducts = async(req,res)=>{
    try {
        const products = await Product.aggregate([
            {
                $sample:{
                    size:4,},

            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1,
                }
            }
        ])
        res.json(products)
    } catch (error) {
        console.log('error in getting recommended products');
        res.status(500).json({message:"internal server error"})
    }
}
export const getProductByCategory = async(req,res)=>{
    const {category} = req.params
    try {
        const products = await Product.find({category});
        res.json(products)
    } catch (error) {
        console.log('error in getting product by category')
        res.status(500).json({message:'Internal server error'})
    }
};
export const toggleFeaturedProduct = async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:'Product not found'})
        }
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();
        await updateFeaturedProductCache()
        res.json(updatedProduct)
    } catch (error) {
        console.log('error in toggling featured product');
        res.status(500).json({message:error.message})
    }
}

const updateFeaturedProductCache = async()=>{
    try {
        const featuredProducts = await Product.find({isFeatured:true}).lean();
        // await redis.set('featured_products',JSON.stringify(featuredProducts))
    } catch (error) {
        console.log('error in updating featured product cache',error.message)

    }
}
