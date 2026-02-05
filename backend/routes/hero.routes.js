// routes/hero.routes.js
import express from 'express';
import {
  getAllHeroImages,
  addHeroImage,
  deleteHeroImage
} from '../controllers/hero.controller.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', getAllHeroImages);
router.post('/',verifyToken,isAdmin, addHeroImage);
router.delete('/:id',verifyToken,isAdmin, deleteHeroImage);

export default router;
