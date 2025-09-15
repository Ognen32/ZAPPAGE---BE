import {
  createFavourite,
  findFavourite,
  findFavourites,
  sortFavouritesbyDate,
  deleteFavourite,
  sortFavouritesbyDateRange
} from "../repositories/favouritesRepository.js";
import { ValidationError } from "../utils/error.js";


export const checkFavourite = async (userId, comicId) => {
  if (!userId || !comicId) {
    throw new ValidationError("User ID and Comic ID are required.");
  }

  const favourite = await findFavourite(userId, comicId);
  return !!favourite; // returns true or false
};

export const toggleFavouriteComic = async (userId, comicId) => {
  if (!userId || !comicId)
    throw new ValidationError("Must Enter both userId and comicId");

  const existingFavourite = await findFavourite(userId, comicId);

  if (existingFavourite) {
    await deleteFavourite(userId, comicId);
    return { status: "removed", message: "Comic removed from favourites" };
  }

  const createdFavourite = await createFavourite(userId, comicId);
  return { status: "added", message: "Comic added to favourites", data: createdFavourite };
};

export const getFavouriteComics = async (userId) => {
  if (!userId) throw new ValidationError("Must enter userid!");

  const favourites = await findFavourites(userId);

  return favourites || []; 
};

export const getSortedFavourites = async (userId) => {
  try {
    if (!userId) throw new Error("Must Enter userid!");
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const thisMonth = new Date(now);
    thisMonth.setMonth(now.getMonth() - 1);
    const favouritesLastThreeDays = await sortFavouritesbyDate(
      userId,
      threeDaysAgo
    );
    const favouritesLastWeek = await sortFavouritesbyDateRange(
      userId,
      oneWeekAgo,
      threeDaysAgo
    );
    const favouritesLastMonth = await sortFavouritesbyDateRange(
      userId,
      thisMonth,
      oneWeekAgo
    );
    return { favouritesLastThreeDays, favouritesLastWeek, favouritesLastMonth };
  } catch (err) {
    throw new Error(err.message);
  }
};

