import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getTotalUsers,
  forgotPassword,
  resetPassword,
  getUserAddress
} from '../controllers/user.controller.js';

import { verifyToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.put('/change-password', verifyToken, changePassword);
router.get("/total",verifyToken, isAdmin, getTotalUsers);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/address', verifyToken, getUserAddress);
export default router;
