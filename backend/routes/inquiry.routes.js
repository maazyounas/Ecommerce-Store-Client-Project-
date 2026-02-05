import express from 'express';
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  deleteInquiry
} from '../controllers/inquiry.controller.js';

const router = express.Router();

// POST /api/inquiries - Create new inquiry
router.post('/', createInquiry);

// GET /api/inquiries - Get all inquiries
router.get('/', getAllInquiries);

// GET /api/inquiries/:id - Get inquiry by ID
router.get('/:id', getInquiryById);

// DELETE /api/inquiries/:id - Delete inquiry by ID
router.delete('/:id', deleteInquiry);

export default router;
