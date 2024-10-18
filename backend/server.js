import express from "express";
import dotenv from 'dotenv';
import authRoute from "./routers/auth.route.js";
import dbConnection from "./db/dbFunction.js";
import cookieParser from "cookie-parser";
import productRouter from "./routers/product.route.js";
import {v2 as cloudinary } from 'cloudinary'
import cartRoute from "./routers/cart.route.js";
import couponRoute from "./routers/coupon.route.js";
import paymentRoute from "./routers/payment.route.js";
import analyticsRoute from "./routers/analytics.route.js";
import cors from 'cors'
import path from "path";

const app = express()
dotenv.config();
const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

app.use(cookieParser())
app.use(express.json({limit:'5mb'}))
app.use(cors())

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true,
})

app.use('/api/auth',authRoute);
app.use('/api/products',productRouter)
app.use('/api/carts',cartRoute);
app.use('/api/payments',paymentRoute);
app.use('/api/coupons',couponRoute);
app.use('/api/analytics',analyticsRoute);


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT,()=>{
    console.log('Running at port',PORT)
    dbConnection()
});
