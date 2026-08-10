import { Router } from "express";
import { createReview, getReviews, getReviewById, updateReview, deleteReview } from "../services/review.service";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/", verifyToken, createReview);
router.get("/", getReviews);
router.get("/:id", getReviewById);
router.patch("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;
