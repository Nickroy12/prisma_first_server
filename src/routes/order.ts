import { Router } from "express";
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from "../services/order.service";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrderById);
router.patch("/:id", verifyToken, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);

export default router;
