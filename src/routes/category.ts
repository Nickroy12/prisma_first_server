import { Router } from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../services/category.service";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/", verifyToken, createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.patch("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);

export default router;
