import { Router } from "express";
import {
  handletoggleFavouriteComic,
  handleGetFavouriteComics,
  getSortedFavouritesHanlder,
  handleCheckFavouriteComic
} from "../controllers/favouritesController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/favourite/check", isAuthenticated,asyncHandler(handleCheckFavouriteComic)); //favs button (is it pressed)
router.post("/favourite", isAuthenticated, asyncHandler(handletoggleFavouriteComic)); //favs button toggle
router.get("/favourites", isAuthenticated, asyncHandler(handleGetFavouriteComics)); //all favs list
router.get("/sortedFavourites", isAuthenticated, getSortedFavouritesHanlder); //favs sorted

export default router;
