import express from "express";
import { createProduct, deleteProduct, getAllProducts, getFeatureProduct, getProductByCategory, getRecommendedProducts, toggleFeaturedProduct } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.get('/',protectRoute,adminRoute ,getAllProducts)
productRouter.get('/feature-product',getFeatureProduct)
productRouter.get('/category/:category',getProductByCategory)
productRouter.get('/recommendation',getRecommendedProducts);
productRouter.patch('/:id',protectRoute,adminRoute,toggleFeaturedProduct)
productRouter.post('/create-product',protectRoute,adminRoute,createProduct)
productRouter.delete('/delete-product/:id',protectRoute,adminRoute,deleteProduct)

export default productRouter