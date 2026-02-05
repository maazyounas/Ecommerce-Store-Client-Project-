import express from 'express';
import {
  createReturn,
  getAllReturns,
  getReturnByUserId,
  updateReturnStatus,
} from '../controllers/return.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';

const router = express.Router();

// POST: Create a new return request
router.post('/', createReturn);

// GET: Get all return requests
router.get('/',verifyToken, isAdmin, getAllReturns);

// GET: Get a single return by ID
router.get('/:id', getReturnByUserId);

// PUT: Update return status
router.put('/:id',verifyToken, isAdmin, updateReturnStatus);



export default router;
