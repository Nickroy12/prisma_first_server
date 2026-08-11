import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/user.service";
import { verifyToken, optionalAuth } from "../middleware/auth";

const router = Router();

// User routes
router.post("/", verifyToken, createUser);
router.get("/", optionalAuth, getUsers);
router.get("/:id", optionalAuth, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;

