import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../services/product.service";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/", verifyToken, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.patch("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
