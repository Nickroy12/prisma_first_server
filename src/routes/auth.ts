import { Router } from "express";
import { register, login, getMe } from "../services/auth.service";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", verifyToken, getMe);

export default router;
