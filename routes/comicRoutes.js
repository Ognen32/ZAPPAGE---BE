import express from 'express';
import {handleCreateComic, updateComicHandler , getTrendingComicsHandler, lookUpAComicHandler, getLatestComicsHandler, ComicsSearchHandler} from '../controllers/comicController.js';
import {uploadComicFiles} from '../middlewares/multer.js';
const router = express.Router();

//admin
router.post("/createComic", uploadComicFiles, handleCreateComic);
router.patch("/updateComic/:id", uploadComicFiles, updateComicHandler);

//landing page
router.get("/landingPage/trendingComics", getTrendingComicsHandler);
router.post("/landingPage/LookUpAComic", lookUpAComicHandler);

//user 
router.get("/latestComics", getLatestComicsHandler);
router.get("/search", ComicsSearchHandler);

export default router;