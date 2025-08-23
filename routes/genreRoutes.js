import { Router } from "express";
import {handleCreateGenre, handleGetGenres} from '../controllers/genreController.js';

const router = Router();

router.post("/genre", asyncHandler(handleCreateGenre)); // Works
router.get("/genres", asyncHandler(handleGetGenres)); // Works

export default router;