import { Router } from "express";
import {handleCreateGenre, handleGetGenres} from '../controllers/genreController.js';
import {asyncHandler} from '../middlewares/asyncHandler.js';

const router = Router();

router.post("/genre", asyncHandler(handleCreateGenre)); 
router.get("/genres", asyncHandler(handleGetGenres)); 

export default router;