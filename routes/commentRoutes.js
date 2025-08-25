import { Router } from "express";
import {
  handleCreateComment,
  handleDeleteComment,
  handleEditComment,
  handleGetCommentsByComic,
} from "../controllers/commentController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/comment", isAuthenticated, asyncHandler(handleCreateComment));
router.delete("/comment/:commentId", isAuthenticated, asyncHandler(handleDeleteComment));
router.patch("/comment/:commentId", isAuthenticated, asyncHandler(handleEditComment));
router.get("/comments/comic/:comicId", asyncHandler(handleGetCommentsByComic));     //raboti ama bez podatoci za user

export default router;
