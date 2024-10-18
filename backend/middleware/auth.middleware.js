import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.access_token;
        if(!token){
           return res.status(401).json({message:'Unauthorized user!'})
        }
        const decoded = await jwt.verify(token,process.env.ACCESS_TOKEN);
        const user = await User.findById(decoded.userId);
        if(!user){
            
            return res.status(401).json({message:"User not found"})
        }

        req.user = user;
        next()
        
    } catch (error) {
        console.log('error in protect route',error.message)
        res.status(500).json({message:'Internal server error'})
    }
}
export const adminRoute = async(req,res,next)=>{
    if(req.user && req.user.role === 'admin' ){
        next()
    } else{
        res.status(401).json({message:"access denaid"})
    }
}