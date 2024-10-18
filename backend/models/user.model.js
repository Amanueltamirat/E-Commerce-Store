import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:['true','Please enter your name!'],       
    },
    email:{
        type:String,
        required:['true','Please enter your email!'],
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:['true','Please enter your password!'],
        minLength:[6,'password must contain at least six characters']
    },
    cartItems:[
        {
            quantity:{
                type:Number,
                default:1
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
                }
        }
    ],
    role:{
        type:String,
        enum:['customer','admin'],
        default:'customer'
    },
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema);
export default User