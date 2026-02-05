// routes/orderItem.routes.js
import express from 'express';
import {
  getAllOrderItems,
  getOrderItemsByOrderId,
  addOrderItems,
  deleteOrderItem
} from '../controllers/orderItem.controller.js';

const router = express.Router();

router.get('/', getAllOrderItems);
router.get('/order/:orderId', getOrderItemsByOrderId);
router.post('/', addOrderItems);
router.delete('/:id', deleteOrderItem);

export default router;
