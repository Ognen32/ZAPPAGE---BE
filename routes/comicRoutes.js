import express from 'express';
import {handleCreateComic} from '../controllers/comicController.js';
import {uploadComicFiles} from '../middlewares/multer.js';
const router = express.Router();

router.post("/createComic", uploadComicFiles, handleCreateComic)

export default router;