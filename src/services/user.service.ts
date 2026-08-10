import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, avatar } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: "name, email, password and role are required", data: {} });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ success: false, message: "Email is already registered", data: {} });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        avatar: avatar ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    res.status(201).json({ success: true, message: "User created successfully", data: user });
  } catch (error) {
    console.error("Create User error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });
    res.status(200).json({ success: true, message: "Users retrieved successfully", data: users });
  } catch (error) {
    console.error("Get Users error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id, isDeleted: false },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found", data: {} });
      return;
    }

    res.status(200).json({ success: true, message: "User retrieved successfully", data: user });
  } catch (error) {
    console.error("Get User By ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, role, avatar } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id, isDeleted: false } });
    if (!existingUser) {
      res.status(404).json({ success: false, message: "User not found", data: {} });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(avatar !== undefined && { avatar }),
      },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });

    res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Update User error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existingUser = await prisma.user.findUnique({ where: { id, isDeleted: false } });
    if (!existingUser) {
      res.status(404).json({ success: false, message: "User not found", data: {} });
      return;
    }

    await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ success: true, message: "User deleted successfully", data: {} });
  } catch (error) {
    console.error("Delete User error:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: {} });
  }
};
