import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { checkoutSuccess, createCheckoutSession } from '../controllers/payment.controller.js';

const paymentRoute = express.Router()
paymentRoute.post("/create-checkout-session", protectRoute, createCheckoutSession);
paymentRoute.post("/checkout-success", protectRoute, checkoutSuccess);
export default paymentRoute