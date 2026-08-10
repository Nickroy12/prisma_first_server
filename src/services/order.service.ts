import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Headers:', req.headers);
    console.log('Body received:', req.body);
    console.log('createOrder received body:', req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized", data: {} });
      return;
    }

    const quantity = req.body?.quantity;

  if (quantity === undefined) {
    res.status(400).json({ success: false, message: "quantity is required", data: {} });
    return;
  }



    const order = await prisma.order.create({
      data: { quantity, userId },
    });

    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    console.error("Create Order error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { isDeleted: false },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.status(200).json({ success: true, message: "Orders retrieved successfully", data: orders });
  } catch (error) {
    console.error("Get Orders error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id, isDeleted: false },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found", data: {} });
      return;
    }

    res.status(200).json({ success: true, message: "Order retrieved successfully", data: order });
  } catch (error) {
    console.error("Get Order By ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const updateOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized", data: {} });
      return;
    }

    const existingOrder = await prisma.order.findUnique({ where: { id, isDeleted: false } });
    if (!existingOrder) {
      res.status(404).json({ success: false, message: "Order not found", data: {} });
      return;
    }

    if (existingOrder.userId !== userId && req.user?.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Forbidden", data: {} });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(quantity !== undefined && { quantity }),
      },
    });

    res.status(200).json({ success: true, message: "Order updated successfully", data: updatedOrder });
  } catch (error) {
    console.error("Update Order error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized", data: {} });
      return;
    }

    const existingOrder = await prisma.order.findUnique({ where: { id, isDeleted: false } });
    if (!existingOrder) {
      res.status(404).json({ success: false, message: "Order not found", data: {} });
      return;
    }

    if (existingOrder.userId !== userId && req.user?.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Forbidden", data: {} });
      return;
    }

    await prisma.order.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ success: true, message: "Order deleted successfully", data: {} });
  } catch (error) {
    console.error("Delete Order error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};
