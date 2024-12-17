import Coupon from "../models/coupon.model.js"

export const getCoupon = async(req,res)=>{
    try {
        const coupon = await Coupon.findOne({userId:req.user.id,isActive:true});
        res.json(coupon || null)
    } catch (error) {
        console.log('error in getting coupon');
        res.status(500).json({message:error.message})
    }
}

export const validateCoupon = async(req,res)=>{
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code:code,isActive:true,userId:req.user._id});
        if(!coupon){
            return res.status(404).json({message:"Coupon not found!"})
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({message:'coupon expired!'})
        }
        res.json({
            message:'coupon is valid',
            code:coupon.code,
            discountPercentage:coupon.discountPercentage
        })
    } catch (error) {
        console.log('error in validating coupon',error.message);
        res.status(500).json({mesasge:error.mesasge})
    }
}