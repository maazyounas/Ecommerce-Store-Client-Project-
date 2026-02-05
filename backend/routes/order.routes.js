// routes/order.routes.js
import express from 'express';
import {
  getOrdersByUser,
  cancelOrder,
  getReturnsByUser,
  getAllOrders,
  updateOrderStatus,
  createOrder
} from '../controllers/order.controller.js';
import {verifyToken} from '../middlewares/auth.middleware.js'
import {isAdmin} from '../middlewares/isAdmin.middleware.js'
const router = express.Router();

router.get('/:userId',getOrdersByUser); // user
router.put('/:id', cancelOrder);
router.get('/return/:userId', getReturnsByUser);
router.get("/", verifyToken, isAdmin, getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.post("/", verifyToken, createOrder);
export default router;
