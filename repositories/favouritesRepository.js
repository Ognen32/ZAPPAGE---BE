import Favourite from "../models/favoritesModel.js";
import Comic from '../models/comicModel.js';
import Genre from "../models/genreModel.js";
import { Op } from "sequelize";

export const createFavourite = async function (userId, comicId) {
  try {
    const favourite = await Favourite.create({
      userId: userId,
      comicId: comicId,
    });
    return favourite;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteFavourite = async function (userId, comicId) {
  try {
    const deleted = await Favourite.destroy({
      where: {
      userId: userId,
      comicId: comicId,
      },
    });
    return deleted;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const findFavourite = async function (userId, comicId) {
  try {
    const favourite = await Favourite.findOne({
      where: {
        userId: userId,
      comicId: comicId,
      },
    });
    return favourite;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findFavourites = async function (userId) {
  try {
    const favourites = await Favourite.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        userId: userId,
      },
      include: [
        {
          model: Comic,
          as: "Comic",
          attributes:["title", "author", "coverArt", "releaseDate", "slug", ],
          include: [
            {
              model: Genre,
              as: "Genres",
              attributes: ["id", "genre" ]
            },
          ],
        },
      ],
    });
    return favourites;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const sortFavouritesbyDate = async function (userId, date) {
  try {
    const favourites = await Favourite.findAll({
      where: {
        userId: userId,
        createdAt: { [Op.gte]: date },
      },
      order: [["createdAt", "DESC"]], 
    });
    return favourites;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const sortFavouritesbyDateRange = async function (
  userId,
  startDate,
  endDate
) {
  try {
    const favourites = await Favourite.findAll({
      where: {
        userid: userId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    return favourites;
  } catch (err) {
    throw new Error(err.message);
  }
};
