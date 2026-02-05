// routes/payment.routes.js
import express from 'express';
import { processPayment } from '../controllers/payment.controller.js';

const router = express.Router();

// POST /api/payments
router.post('/', processPayment);

export default router;
