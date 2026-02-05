// routes/review.routes.js
import express from 'express';
import {
  getAllReviews,
  getReviewsByProduct,
  createReview,
  deleteReview,
  getProductReviewsSummary,
  getProductReviewsDetails,
  getQuestionsByProductId,
  addQuestion,
  getUserReviews
} from '../controllers/review.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/:reviewId', getReviewsByProduct);
router.post('/', createReview);
router.delete('/:id', deleteReview);
router.get('/detail/:productId', getProductReviewsSummary);
router.get('/productReviewDetail/:productId', getProductReviewsDetails);
router.get('/questions/:productId', getQuestionsByProductId);
router.get('/questionByReviewId/:productId', getQuestionsByProductId);
router.post('/add-question',verifyToken, addQuestion);
router.get('/user/:userId', getUserReviews);

export default router;
