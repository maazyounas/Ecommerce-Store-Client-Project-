import express from 'express';
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon
} from '../controllers/coupon.controller.js';

const router = express.Router();

// POST: Create a new coupon
router.post('/', createCoupon);

// GET: Get all coupons
router.get('/', getAllCoupons);

// GET: Get a specific coupon by ID
router.get('/:id', getCouponById);

// PUT: Update a coupon
router.put('/:id', updateCoupon);

// DELETE: Delete a coupon
router.delete('/:id', deleteCoupon);

// POST: Apply a coupon (validate it for a user/order)
router.post('/apply', applyCoupon);

export default router;
