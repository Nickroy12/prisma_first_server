import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, stock, categoryId } = req.body;

    if (!title || !description || price === undefined || stock === undefined) {
      res.status(400).json({ success: false, message: "title, description, price, and stock are required", data: {} });
      return;
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId, isDeleted: false } });
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found", data: {} });
        return;
      }
    }

    const product = await prisma.product.create({
      data: { title, description, price, stock, categoryId },
    });

    res.status(201).json({ success: true, message: "Product created successfully", data: product });
  } catch (error) {
    console.error("Create Product error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      include: { category: true },
    });
    res.status(200).json({ success: true, message: "Products retrieved successfully", data: products });
  } catch (error) {
    console.error("Get Products error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id, isDeleted: false },
      include: {
        category: true,
        reviews: {
          where: { isDeleted: false },
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found", data: {} });
      return;
    }

    res.status(200).json({ success: true, message: "Product retrieved successfully", data: product });
  } catch (error) {
    console.error("Get Product By ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, price, stock, categoryId } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id, isDeleted: false } });
    if (!existingProduct) {
      res.status(404).json({ success: false, message: "Product not found", data: {} });
      return;
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId, isDeleted: false } });
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found", data: {} });
        return;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(categoryId !== undefined && { categoryId }),
      },
    });

    res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error("Update Product error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existingProduct = await prisma.product.findUnique({ where: { id, isDeleted: false } });
    if (!existingProduct) {
      res.status(404).json({ success: false, message: "Product not found", data: {} });
      return;
    }

    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ success: true, message: "Product deleted successfully", data: {} });
  } catch (error) {
    console.error("Delete Product error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};
