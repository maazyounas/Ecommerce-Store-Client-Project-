import express from "express";
import {
  createCategory,
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  getCategoryBySlug,
  getSubcategories,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from "../controllers/category.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/subcategories/:parentId", getSubcategories);
router.get("/:id", getCategoryById);

// Admin routes
router.get("/admin/all", verifyToken, isAdmin, getAllCategoriesAdmin);
router.post("/", verifyToken, isAdmin, createCategory);
router.put("/:id", verifyToken, isAdmin, updateCategory);
router.patch("/:id/toggle-status", verifyToken, isAdmin, toggleCategoryStatus);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

export default router;
