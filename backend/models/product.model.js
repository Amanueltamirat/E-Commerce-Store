import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:['true','Please enter product name!']
    },
    description:{
        type:String,
        default:'',
        required:['true','PLease enter product description!']
    },
    price:{
        type:Number,
        required:['true','Please enter product price!']
    },
    image:{
        type:String,
        default:'',
        required:['true','Please enter product image!']
    },
    category:{
        type:String,
        required:['true','Please enter product category!']
    },
    isFeatured:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
})


const Product = mongoose.model('Product',productSchema);

export default Product