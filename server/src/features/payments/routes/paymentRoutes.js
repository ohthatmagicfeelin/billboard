// server/src/routes/paymentRoutes.js
import express from 'express';


import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();


// Signup endpoint
// router.post('/signup', paymentController.createUser);
router.post('/create-payment-intent', paymentController.createPaymentIntent);


export default router;

