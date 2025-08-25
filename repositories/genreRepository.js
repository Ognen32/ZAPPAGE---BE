import Genre from "../models/genreModel.js";

export const createGenre = async function (genreName) {
  try {
    const genre = await Genre.create({ genre: genreName });
    return genre;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findGenreByName = async function (genreName) {
  try {
    return await Genre.findOne({ where: { genre: genreName } });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findGenreByID = async function (genreID) {
  try {
    return await Genre.findOne({
      where: { id: genreID },
      attributes: ["id", "genre"],
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findAllGenres = async function () {
  try {
    return await Genre.findAll();
  }
  catch (err) {
    throw new Error(err.message);
  }
};
