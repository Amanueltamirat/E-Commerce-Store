import User from "../models/user.model.js";
// import bcrypt from "bcryptjs/dist/bcrypt.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// import { redis } from "../lib/redis.js";

const generateToken = (userId)=>{
    const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN,{
        expiresIn: "15m",
    })
    const refreshToken = jwt.sign({userId},process.env.GENERATE_TOKEN,{
        expiresIn: "10d",
    })
    return {accessToken,refreshToken}
}

// const storeRefreshToken = async(userId,refreshToken)=>{
//     await redis.set(`refresh_token:${userId}`,refreshToken,'EX',10*24*60*60)
// }

const setCookies = (res,accessToken,refreshToken)=>{
    res.cookie('access_token',accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge:15*60*1000
    })
     res.cookie('refresh_token',refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge:10*24*60*60*1000 
    })
}
export const signUp = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
     const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if(!emailRegex.test(email)){
       return res.status(400).json({success:false,message:'Please enter a valid email address!'})
     }
     const existUser = await User.findOne({email});
     if(existUser){
      return  res.status(400).json({success:false,message:'User already exist!'})
     }
     if(password.length < 6){
        return res.status(400).json({success:false,message:'Password must contain at least six characters!'})
     }
     if(!name || !email || !password){
        return res.status(400).json({success:false,message:'All fields are required!'})
     }

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt)

const newUser = new User({
    name,
    email,
    password:hashedPassword
})

await newUser.save();
//authenticate

const {accessToken,refreshToken} = generateToken(newUser._id)
// await storeRefreshToken(newUser._id,refreshToken)
setCookies(res,accessToken,refreshToken)

res.status(200).json({newUser:{
    _id:newUser._id,
    name:newUser.name,
    email:newUser.email,
    role:newUser.role   
}})
    } catch (error) {
        console.log('error in signup controller',error.message)
    }
}
export const signIn = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({success:false,message:'All fields are required!'})
        }

        const user = await User.findOne({email})
        if(!user){
           return res.status(404).json({success:false,message:'User not found!'})
        }
const isPasswordValid = await bcrypt.compare(password,user?.password);
if(!isPasswordValid){
    return res.status(404).json({success:false,message:'Invalid password'})
}
const {accessToken,refreshToken} = generateToken(user._id)
// await storeRefreshToken(user._id,refreshToken);
setCookies(res,accessToken,refreshToken);

res.json({
    _id:user._id,
    name:user.name,
    email:user.email,
    role:user.role
})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}
export const signOut = async(req,res)=>{
    try {
       const refreshToken = req.cookies.refresh_token;
       if(refreshToken){
        const decoded = jwt.verify(refreshToken,process.env.GENERATE_TOKEN);
        // await redis.del(`refresh_token:${decoded.userId}`)
       } 
       res.clearCookie('access_token');
       res.clearCookie('refresh_token');
       res.json({message:'Logout successfully!'})

    } catch (error) {
        res.status(500).json({message:"Interanl server error"})
    }
};

export const refreshToken = async(req,res)=>{
   try {
     const refreshToken = req.cookies.refresh_token;
    if(!refreshToken){
        return res.status(402).json({message:'Refresh token not found!'})
    };

    const decoded =  jwt.verify(refreshToken,process.env.GENERATE_TOKEN);
    // const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    // if(refreshToken !== storedToken){
    //     return res.status(404).json({message:'Invalid refresh token!'})
    // };

    const accessToken = jwt.sign({userId:decoded.userId},process.env.ACCESS_TOKEN,{
        expiresIn:"15m"
    });
     res.cookie('access_token',accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge:15*60*1000
    })
    res.status(200).json({message:'Refresh token successfully!'})
   } catch (error) {
    res.status(500).json({message:"Internal server error"})
   }
}
export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
