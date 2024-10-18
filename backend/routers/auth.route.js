import express from "express";
import { getProfile, refreshToken, signIn, signOut, signUp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoute = express.Router();
authRoute.post('/signup',signUp)
authRoute.post('/login',signIn)
authRoute.post('/logout',signOut)
authRoute.post('/refresh-token',refreshToken)
authRoute.get('/profile',protectRoute,getProfile)
export default authRoute