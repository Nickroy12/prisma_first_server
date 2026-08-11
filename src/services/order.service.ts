import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required", data: {} });
      return;
    }

    const { quantity, productId } = req.body;

    if (quantity === undefined || isNaN(Number(quantity))) {
      res.status(400).json({ success: false, message: "A valid quantity is required", data: {} });
      return;
    }

    if (!productId) {
      res.status(400).json({ success: false, message: "productId is required", data: {} });
      return;
    }

    // Verify user exists in DB
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      res.status(404).json({ success: false, message: "User not found", data: {} });
      return;
    }

    // Verify product exists in DB
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      res.status(404).json({ success: false, message: "Product not found", data: {} });
      return;
    }

    const order = await prisma.order.create({
      data: {
        quantity: Number(quantity),
        userId,
        productId
      },
      include: {
        product: { select: { id: true, title: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    console.error("Create Order error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const userId = req.query.userId as string | undefined;

    // Build filter: admin/full list includes deleted; client view can show active or soft-deleted
    const where: Record<string, unknown> = {};
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    if (userId) {
      where.userId = userId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, title: true, price: true } },
      },
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

    const order = await prisma.order.findFirst({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, title: true, price: true } },
      },
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

    const existingOrder = await prisma.order.findFirst({
      where: { id }
    });

    if (!existingOrder) {
      res.status(404).json({ success: false, message: "Order not found", data: {} });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(quantity !== undefined && { quantity: Number(quantity) }),
      },
      include: {
        product: { select: { id: true, title: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
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
    const isHardDelete = req.query.hard === 'true' || req.query.force === 'true';

    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      res.status(404).json({ success: false, message: "Order not found", data: {} });
      return;
    }

    if (isHardDelete) {
      // Hard Delete: Permanently remove from DB
      await prisma.order.delete({
        where: { id },
      });
      res.status(200).json({ success: true, message: "Order permanently deleted (Hard Delete)", data: {} });
    } else {
      // Soft Delete: Set isDeleted = true
      await prisma.order.update({
        where: { id },
        data: { isDeleted: true },
      });
      res.status(200).json({ success: true, message: "Order soft deleted (Cancelled)", data: {} });
    }
  } catch (error) {
    console.error("Delete Order error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};