import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized", data: {} });
      return;
    }

    const { rating, comment, productId } = req.body;

    if (rating === undefined || !productId) {
      res.status(400).json({ success: false, message: "rating and productId are required", data: {} });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id: productId, isDeleted: false } });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found", data: {} });
      return;
    }

    const review = await prisma.review.create({
      data: { rating, comment, productId, userId },
    });

    res.status(201).json({ success: true, message: "Review created successfully", data: review });
  } catch (error) {
    console.error("Create Review error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isDeleted: false },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    res.status(200).json({ success: true, message: "Reviews retrieved successfully", data: reviews });
  } catch (error) {
    console.error("Get Reviews error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const review = await prisma.review.findUnique({
      where: { id, isDeleted: false },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    if (!review) {
      res.status(404).json({ success: false, message: "Review not found", data: {} });
      return;
    }

    res.status(200).json({ success: true, message: "Review retrieved successfully", data: review });
  } catch (error) {
    console.error("Get Review By ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized", data: {} });
      return;
    }

    const existingReview = await prisma.review.findUnique({ where: { id, isDeleted: false } });
    if (!existingReview) {
      res.status(404).json({ success: false, message: "Review not found", data: {} });
      return;
    }

    if (existingReview.userId !== userId && req.user?.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Forbidden", data: {} });
      return;
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
      },
    });

    res.status(200).json({ success: true, message: "Review updated successfully", data: updatedReview });
  } catch (error) {
    console.error("Update Review error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized", data: {} });
      return;
    }

    const existingReview = await prisma.review.findUnique({ where: { id, isDeleted: false } });
    if (!existingReview) {
      res.status(404).json({ success: false, message: "Review not found", data: {} });
      return;
    }

    if (existingReview.userId !== userId && req.user?.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Forbidden", data: {} });
      return;
    }

    await prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ success: true, message: "Review deleted successfully", data: {} });
  } catch (error) {
    console.error("Delete Review error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};
