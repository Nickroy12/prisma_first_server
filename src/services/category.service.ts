import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "name is required", data: {} });
      return;
    }

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      res.status(409).json({ success: false, message: "Category with this name already exists", data: {} });
      return;
    }

    const category = await prisma.category.create({
      data: { name, description },
    });

    res.status(201).json({ success: true, message: "Category created successfully", data: category });
  } catch (error) {
    console.error("Create Category error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isDeleted: false },
    });
    res.status(200).json({ success: true, message: "Categories retrieved successfully", data: categories });
  } catch (error) {
    console.error("Get Categories error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const category = await prisma.category.findUnique({
      where: { id, isDeleted: false },
    });

    if (!category) {
      res.status(404).json({ success: false, message: "Category not found", data: {} });
      return;
    }

    res.status(200).json({ success: true, message: "Category retrieved successfully", data: category });
  } catch (error) {
    console.error("Get Category By ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description } = req.body;

    const existingCategory = await prisma.category.findUnique({ where: { id, isDeleted: false } });
    if (!existingCategory) {
      res.status(404).json({ success: false, message: "Category not found", data: {} });
      return;
    }

    if (name && name !== existingCategory.name) {
      const nameTaken = await prisma.category.findUnique({ where: { name } });
      if (nameTaken) {
        res.status(409).json({ success: false, message: "Category name is already taken", data: {} });
        return;
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.status(200).json({ success: true, message: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    console.error("Update Category error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existingCategory = await prisma.category.findUnique({ where: { id, isDeleted: false } });
    if (!existingCategory) {
      res.status(404).json({ success: false, message: "Category not found", data: {} });
      return;
    }

    await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ success: true, message: "Category deleted successfully", data: {} });
  } catch (error) {
    console.error("Delete Category error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};
