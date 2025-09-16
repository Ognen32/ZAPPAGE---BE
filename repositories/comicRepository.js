import Comic from "../models/comicModel.js";
import { Op } from "sequelize";
import Genre from "../models/genreModel.js"

export const createComicInstance = async function (comicData) {
  try {
    const comic = await Comic.create({
      title: comicData.title,
      slug: comicData.slug,
      author: comicData.author,
      shortDescription: comicData.shortDescription,
      description: comicData.description,
      releaseDate: comicData.releaseDate,
      publisher: comicData.publisher,
      mainCover: comicData.mainCover,
      coverArt: comicData.coverArt,
      page_count: comicData.page_count,
      totalViewed: comicData.totalViewed,
    });
    return comic;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateComic = async function (comicId, comicData) {
  try{
    const comic = await Comic.findByPk(comicId);
    if (!comic)
      throw new Error("Comic not found");

    await comic.update({
      title: comicData.title,
      slug: comicData.slug,
      author: comicData.author,
       shortDescription: comicData.shortDescription,
      description: comicData.description,
      releaseDate: comicData.releaseDate,
      publisher: comicData.publisher,
      mainCover: comicData.mainCover,
      coverArt: comicData.coverArt,
      page_count: comicData.page_count,
      totalViewed: comicData.totalViewed,
    });
    return comic;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findComicByTitle = async function (title) {
  try {
    const comic = await Comic.findOne({where: {title: title} })
    return comic
  } catch (err) {
    throw new Error(err.message);
  }
}

//landing page
export const findTrendingComicsLandingPage= async function () {
  try {
    const comics = await Comic.findAll({
      attributes: ["id", "title", "author", "coverArt", "slug", "releaseDate", "publisher", "totalViewed"],
      order: [["totalViewed", "DESC"]],
      limit: 12,
      include: [
        {
          model: Genre,
          as: "Genres",
          attributes: ["id", "genre"],
          through: { attributes: [] },
        },
      ],
    });
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findComicsSearchLandingPage = async function () {
  try {
    const comics = await Comic.findAll({
      attributes: ["id", "title", "author", "coverArt"],
      order: [["title", "ASC"]],
      limit: 10,
      include: [
        {
          model: Genre,
          as: "Genres",
          attributes: ["id", "genre"],
          through: { attributes: [] },
        },
      ],
    });
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findComicsSearchOnlyLanding = async function (search) {
  try {
    const comics = await Comic.findAll({
      attributes: ["id", "title", "author", "coverArt"],
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["title", "ASC"]],
      limit: 10,
      include: [
        {
          model: Genre,
          as: "Genres",
          attributes: ["id", "genre"],
          through: { attributes: [] },
        },
      ],
    });
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findComicsByGenresOnlyLanding = async function (genres) {
  try {
    const comics = await Comic.findAll({
      attributes: ["id", "title", "author", "coverArt"],
      order: [["title", "ASC"]],
      limit: 10,
      include: [
        {
          model: Genre,
          as: "Genres",
          attributes: ["id", "genre"],
          where: {
            genre: {
              [Op.in]: genres,
            },
          },
          through: { attributes: [] },
        },
      ],
    });
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findComicsBySearchAndGenresLanding = async function (search, genres) {
  try {
    const comics = await Comic.findAll({
      attributes: ["id", "title", "author", "coverArt"],
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["title", "ASC"]],
      limit: 10,
      include: [
        {
          model: Genre,
          as: "Genres",
          attributes: ["id", "genre"],
          where: {
            genre: {
              [Op.in]: genres,
            },
          },
          through: { attributes: [] },
        },
      ],
    });
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

//user view latest comics
export const findLatestAddedComics = async function () {
  try {
    const comics = await Comic.findAll({
      attributes: ["id", "title", "author", "coverArt", "slug", "releaseDate", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 12,
      include: [
        {
         model: Genre,
         as: "Genres",
          attributes: ["id", "genre"],
          through: { attributes: [] },
        },
      ],
  });
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

//user view search
export const findComicsSearch = async function (search, limit, pageNum, ) {
  try {
    const comics = await Comic.findAll({
      attributes: ["id", "title", "author", "coverArt", "totalViewed", "slug", "releaseDate", "createdAt"],
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["title", "ASC"]],
      limit:limit,
      offset: (pageNum - 1) * limit,
      include: [
        {
          model: Genre,
          as: "Genres",
          attributes: ["id", "genre"],
          through: { attributes: [] },
        },
      ],
    });
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findComicsSearchWithGenre = async function (search, limit, pageNum, genres) {
  try {
    const comics = await Comic.findAll({
      attributes: ["id", "title", "author", "coverArt", "totalViewed", "slug", "releaseDate", "createdAt"],
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [["title", "ASC"]],
      limit:limit,
      offset: (pageNum - 1) * limit,
      include: [
        {
          model: Genre,
          as: "Genres",
          attributes: ["id", "genre"],
          where: {
            genre: {
              [Op.in]: genres,
            },
          },
          through: { attributes: [] },
        },
      ],
    });
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

//Comic view
export const findComicBySlug = async function (slug) {
  try {
    const comic = await Comic.findOne({
      where: { slug: slug },
      include: [
        {
          model: Genre,
          as: "Genres",
          attributes: ["id", "genre"],
          through: { attributes: [] },
        },
      ],
    });
    return comic;
  } catch (err) {
    throw new Error(err.message);
  }
};