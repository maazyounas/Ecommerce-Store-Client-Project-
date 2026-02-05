import { addToCart, getCartItems, deleteCartItem } from "../controllers/cart.controller.js";
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/add',verifyToken, addToCart);
router.get('/getproduct', verifyToken,getCartItems);
router.delete('/:productId',verifyToken, deleteCartItem);

export default router;