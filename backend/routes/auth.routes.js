// routes/auth.js
import { verifyToken } from '../middlewares/auth.middleware.js';
import express from 'express';
const router = express.Router();
router.get('/me', verifyToken, (req, res) => {
  console.log("auth me working");
  res.json({ user: req.user });
});

export default router;
