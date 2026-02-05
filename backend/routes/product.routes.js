// routes/product.routes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getProductDescription,
  getRecommendedProducts,
  getAllProductQuestions,
  replyToQuestion,
  getProductsByCategory,
  getAllFlashProducts,
  searchProducts
} from '../controllers/product.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/add', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get("/details/:productId", getProductDetails);
router.get('/description/:productId', getProductDescription);
router.get('/recommend/:productId', getRecommendedProducts);

router.get('/questions/users', verifyToken, isAdmin, getAllProductQuestions);
router.put('/questions/:id', verifyToken, isAdmin, replyToQuestion);
router.get('/category/:id', getProductsByCategory);
router.get('/flashProduct', getAllFlashProducts);
router.get('/search', searchProducts);

export default router;
