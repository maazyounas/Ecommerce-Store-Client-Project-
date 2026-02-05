// routes/productImage.routes.js
import express from 'express';
import {
  getImagesByProductId,
  addProductImage,
  deleteProductImage
} from '../controllers/productImage.controller.js';

const router = express.Router();

router.get('/:productId', getImagesByProductId);
router.post('/', addProductImage);
router.delete('/:id', deleteProductImage);

export default router;
