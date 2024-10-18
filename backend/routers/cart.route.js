import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addToCart, getCart, removeFromCart, updateQuantity } from "../controllers/cart.controller.js";

const cartRoute = express.Router();

cartRoute.get('/',protectRoute,getCart);
cartRoute.post('/',protectRoute,addToCart);
cartRoute.delete('/',protectRoute,removeFromCart);
cartRoute.put('/:id',protectRoute,updateQuantity)

export default cartRoute