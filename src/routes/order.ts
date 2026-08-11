import { Router } from "express";
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from "../services/order.service";
import { verifyToken, optionalAuth } from "../middleware/auth";

const router = Router();

router.post("/", optionalAuth, createOrder);
router.get("/", optionalAuth, getOrders);
router.get("/:id", optionalAuth, getOrderById);
router.patch("/:id", optionalAuth, updateOrder);
router.delete("/:id", optionalAuth, deleteOrder);

export default router;

