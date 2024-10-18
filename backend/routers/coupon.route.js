import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const couponRoute = express.Router()
couponRoute.get('/',protectRoute,getCoupon);
couponRoute.post('/validate',protectRoute,validateCoupon)
export default couponRoute